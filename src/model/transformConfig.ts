import { pipe } from "../../libs/esm/fp-ts/function.ts";
import { TransformedConfig } from "../types/TransformedConfig.ts";
import { type Config } from "../types/Config.ts";
import { globToPaths } from "../utils/globToPaths.ts";
import { makeAbsolute } from "../utils/makeAbsolute.ts";
import { parseVersion } from "../utils/parseVersion.ts";
import { uniqueArray } from "../utils/uniqueArray.ts";
import { createBuildOptions } from "./createBuildOptions.ts";
import { loadAccessTokenValueSync } from "./loadAccessTokenValue.ts";





export const createEntryPoints = async (sourceDir: string, outDir: string, include: string[], exclude: string[]): Promise<string[]> => {
    const globsToPaths = async (globs: string[], options: Parameters<typeof globToPaths>[1]) => {
        const paths = await Promise.all(globs.map(glob => globToPaths(glob, options)));

        return uniqueArray(paths.flat());
    }

    const excludePaths = await globsToPaths(exclude, {
        root: sourceDir,
        includeDirs: true,
        extended: true,
        globstar: true,
        caseInsensitive: false,
        onlyInsiders: false,
        onlyExists: false,
    });

    const includePaths = await globsToPaths(include, {
        root: sourceDir,
        exclude: [...excludePaths, outDir],
        includeDirs: false,
        extended: true,
        globstar: true,
        caseInsensitive: false,
        onlyInsiders: true,
        onlyExists: false,
    });

    return pipe(
        includePaths.map(path => makeAbsolute(path, sourceDir)),
        uniqueArray,
    );
}


/**
 * Create transfomed dependencies config.
 * 
 * @param options Config options
 * @param installDir Path to install directory
 * @param root Config root directory
 * @returns Transformed dependencies config
 */
const createDependencies = (options: Config['dependencies'], installDir: string, root: string): TransformedConfig['dependencies'] => {
    if (options === undefined) {
        return [];
    }

    // FIXME: Load global access tokens

    return Object.entries(options)
        .map(([reference, value]) => {
            if (typeof value === 'string') {
                return {
                    reference,
                    absDestination: installDir,
                    tag: value,
                    name: undefined,
                    accessTokens: [],
                };
            }

            const accessToken = (value.accessToken !== undefined)
                ? loadAccessTokenValueSync(value.accessToken, root)
                : undefined;

            return {
                reference,
                absDestination: value.destination ? makeAbsolute(value.destination, installDir) : installDir,
                tag: value.tag,
                name: value.name,
                accessTokens: (accessToken !== undefined) ? [accessToken] : [],
            }
        })
        // FIXME: Append global access tokens
        .map(x => x)
}


/**
 * Transform source config object to a more usable internal format.
 */
export const transformConfig = async (config: Config, configRoot: string): Promise<TransformedConfig> => {
    const defaultResolveExtensions = ['.ts', '.tsx', '.mts', '.js', '.jsx', '.mjs'] as const;

    const defaults = {
        outDir: './build',
        rootDir: './',
        dependenciesDir: './dependencies',
        include: defaultResolveExtensions.map(ext => `**/*${ext}`),
        exclude: [configRoot],
    }

    const version = parseVersion(config.version ?? '');
    const watch = config.watch ?? false;
    const absOutDir = makeAbsolute(configRoot, config.outDir ?? defaults.outDir);
    const absRootDir = makeAbsolute(configRoot, config.rootDir ?? defaults.rootDir);
    const absDependenciesDir = makeAbsolute(configRoot, config.dependenciesDir ?? defaults.dependenciesDir);
    const absTsconfigPath = config.tsconfig ? makeAbsolute(configRoot, config.tsconfig) : undefined;
    const dependencies = createDependencies(config.dependencies, absDependenciesDir, configRoot);
    const filesToWatch = [absTsconfigPath].filter((s): s is string => s !== undefined);

    const include = config.include ?? defaults.include;
    const exclude = config.exclude ?? defaults.exclude;
    const entryPoints = await createEntryPoints(absRootDir, absOutDir, include, exclude);

    const build = createBuildOptions(config.build, entryPoints, absTsconfigPath);

    return {
        version,
        watch,
        absOutDir,
        absRootDir,
        build,
        dependencies,
        filesToWatch,
    }
}