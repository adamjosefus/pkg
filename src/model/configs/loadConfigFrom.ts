/**
 * @copyright Copyright (c) 2022 Adam Josefus
 */

import { basename, join } from "../../libs/path.ts";
import { formatVersion } from "../helpers/formatVersion.ts";
import { makeAbsolute } from "../helpers/makeAbsolute.ts";
import { type ConfigType, type Options as ConfigOptions } from "./ConfigType.ts";
import { type RepositoryType } from "./RepositoryType.ts";
import { configPath } from "./configPath.ts";
import { parseConfigFileData } from "./parseConfigFileData.ts";
import { createTokensFormDeclarations, loadGlobalTokensFrom, TokenType } from "../tokens/mod.ts";


type Options = {
    checkVersion?: boolean,
    useGlobalTokens?: boolean | null,
}


/**
 * Loads and creates a config object from the given directory.
 * 
 * @param root Directory to search for config file.
 */
export async function loadConfigFrom(root: string, injectedTokens: TokenType[], options: Options): Promise<ConfigType> {
    // Load config data
    const file = configPath(root);
    const data = parseConfigFileData(file, options.checkVersion ?? true);

    /**
     * Create destination dir from the config file.
     */
    function createDestinationDir(root: string, dir: string | undefined): string | null {
        return dir ? makeAbsolute(dir, root) : null;
    }

    /**
     * Create repositories from the config file.
     */
    function createRepositories(root: string, declarations: typeof data.repositories = {}, destinationDir: string | null): RepositoryType[] {
        return Object.entries(declarations)
            // Normalize the repository declaration
            .flatMap(([reference, declaration]) => {
                if (typeof declaration === "string") {
                    return [{
                        reference,
                        tag: declaration,
                    }];
                } else if (!Array.isArray(declaration)) {
                    return [{
                        ...declaration,
                        reference,
                    }];
                } else {
                    return declaration.map(({ tag, ...rest }) => ({
                        ...rest,
                        reference,
                        tag,
                    }));
                }
            })
            // Adds token to the repository reference; Adds defaults
            .map(({ reference, destination, name, tag, disabled }) => ({
                reference: reference,
                destinationDir: destination ?? destinationDir ?? null,
                name: name ?? basename(reference, '.git'),
                tag: tag ?? null,
                disabled: disabled ?? false,
            }))
            // Filter disabled repositories
            .filter(({ disabled }) => !disabled)
            // Filter repositories with no destination
            .filter(({ destinationDir }) => destinationDir !== null)
            // `destinationDir` → `destinationDir/name`
            .map(({ destinationDir, ...rest }) => ({
                ...rest,
                destination: join(destinationDir!, rest.name),
            }))
            // Make destination directory absolute
            .map(({ destination, ...rest }) => ({
                ...rest,
                destination: makeAbsolute(destination!, root),
            }));
    }

    /**
     * Create tokens from the config file.
     */
    async function createTokens(declarations: typeof data.tokens, injectedTokens: TokenType[], useGlobalTokens: boolean): Promise<TokenType[]> {
        const globalTokens = useGlobalTokens ? await loadGlobalTokensFrom(root) : [];
        const currentTokens = [...injectedTokens, ...globalTokens];

        const tokens = await createTokensFormDeclarations(declarations ?? {}, {
            skipNonExistOrigins: currentTokens.map(t => t.origin)
        });

        return [...currentTokens, ...tokens];
    }

    /**
     * Normalize the config file.
     */
    function createIgnore(arr?: string[]): string[] {
        return arr ?? [];
    }

    /**
     * Normalize options.
     */
    function createOptions(opt: undefined | typeof data.options, forceUseGlobalTokens: boolean | null): ConfigOptions {
        return {
            updateNpmConfig: opt?.updateNpmConfig ?? false,
            installNpmModules: opt?.installNpmModules ?? false,
            useGlobalTokens: forceUseGlobalTokens ?? opt?.useGlobalTokens ?? false,
        }
    }


    // Create config object
    const opt = createOptions(data.options, options.useGlobalTokens ?? null);
    const destinationDir = createDestinationDir(root, data.destination);
    const tokens = await createTokens(data.tokens, injectedTokens, opt.useGlobalTokens);
    const repositories = createRepositories(root, data.repositories, destinationDir);
    const ignore = createIgnore(data.ignore);

    const config = {
        version: formatVersion(data.version ?? ''),
        destinationDir,
        repositories,
        tokens,
        ignore,
        options: opt,
    } as ConfigType;

    return config;
}
