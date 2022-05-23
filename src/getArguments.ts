/**
 * @copyright Copyright (c) 2022 Adam Josefus
 */

import { bold, gray } from "./libs/colors.ts";
import { Arguments, InfoInterruption, ExpectedException } from "./libs/allo_arguments.ts";
import { type ConfigExtensionType, currentVersion } from "./dogma.ts";
import { cleanTokenOrigin, TokenType } from "./model/tokens/mod.ts";
import { formatVersion } from "./model/helpers/formatVersion.ts";
import { globalTokensPath } from "./globalTokensPath.ts";


function initFlag(v?: boolean | null | string): false | ConfigExtensionType {
    if (v === undefined || v === null || v === false) return false;
    if (v === true) return ".jsonc";

    switch (v.toLowerCase().trim().replace(/^\./g, '')) {
        case "false":
            return false;

        case "true":
        case "jsonc":
            return ".jsonc";

        case "json":
            return ".json";

        default:
            throw new ExpectedException(`The "${v}" extension is not supported.`);
    }
}


function booleanFlag(v?: boolean | string | null): boolean {
    if (v === undefined || v === null || v === false) return false;
    if (v === true) return true;

    switch (v.toLowerCase().trim()) {
        case "true":
            return true;

        default:
            return false;
    }
}

function optionalBooleanFlag(v?: boolean | string | null): boolean | null {
    if (v === null || v === undefined) return null;
    if (v === false) return false;
    if (v === true) return true;

    switch (v.toLowerCase().trim()) {
        case "true":
            return true;

        case "false":
            return false;

        default:
            return null;
    }
}


function tokensFlag(v?: string | null): TokenType[] {
    if (!v) return [];

    return v.split(',').map(s => {
        const [secret, origin] = s.split('@');

        return {
            origin: cleanTokenOrigin(origin),
            secret: secret.trim()
        }
    });
}


export function getArguments(root: string) {
    const args = new Arguments(
        {
            name: 'install, i',
            description: `Installs packages from the config file.`,
            convertor: booleanFlag,
        },
        {
            name: 'uninstall, ui',
            description: `Deletes packages according to the config file.\nRequires comfirmation.`,
            convertor: booleanFlag,
        },
        {
            name: 'delete-destinations, deldest',
            description: `Deletes the destination directory.\nRequires comfirmation.`,
            convertor: booleanFlag,
        },
        {
            name: 'tokens, token',
            description: `Extends the token list with the given tokens. (--tokens=<token>@<origin>,...)`,
            convertor: tokensFlag,
        },
        {
            name: 'version, v',
            description: [
                `Print version.`,
                `Stops execution.`,
            ],
            convertor: booleanFlag,
        },
        {
            name: 'init',
            description: [
                `Initialize config file.`,
                `Use can specify the file extension using the "--init=json" or "--init=jsonc".`,
                `Stops execution.`,
            ],
            convertor: initFlag,
        },
        {
            name: 'add-global-tokens, add-global-token',
            description: [
                `Sets global tokens to use. (--add-global-tokens=<token>@<origin>,...)`,
                `Tokens will be added to the "${globalTokensPath(root)}".`,
                `Stops execution.`,
            ],
            convertor: tokensFlag,
        },
        {
            name: 'update-npm-config',
            description: [
                `Overwrites "option.updateNpmConfig" of the config file to update "package.json".`,
                `--update-npm-config=<boolean>`,
            ],
            convertor: optionalBooleanFlag,
        },
        {
            name: 'install-npm-modules',
            description: [
                `Overrides "option.installNpmModules" of the config file to install npm modules.`,
                `--install-npm-modules=<boolean>`,
            ],
            convertor: optionalBooleanFlag,
        },
        {
            name: 'use-global-tokens',
            description: [
                `Overrides "option.useGlobalTokens" of the config file to use global tokens.`,
                `--use-global-tokens=<boolean>`,
            ],
            convertor: optionalBooleanFlag,
        },
        {
            name: 'skip-version-check',
            description: `Disables checking the version of the config files.`,
            convertor: booleanFlag,
        },
        {
            name: 'force',
            description: `If true, the script will not ask for confirmation.`,
            convertor: booleanFlag,
        },
    );

    args.setDescription(`PKG is a tool for managing your packages.`);

    if (args.shouldHelp()) {
        args.triggerHelp();
    }


    if (args.get<boolean>('version')) {
        throw new InfoInterruption([
            bold(`PKG ${formatVersion(currentVersion)}`),
            gray(`Deno v${Deno.version.deno}`),
            gray(`TypeScript v${Deno.version.typescript}`),
        ].join('\n'));
    }


    return {
        install: args.get<ReturnType<typeof booleanFlag>>('install'),
        uninstall: args.get<ReturnType<typeof booleanFlag>>('uninstall'),
        deleteDestinations: args.get<ReturnType<typeof booleanFlag>>('delete-destinations'),
        tokens: args.get<ReturnType<typeof tokensFlag>>('tokens'),

        init: args.get<ReturnType<typeof initFlag>>('init'),
        addGlobalTokens: args.get<ReturnType<typeof tokensFlag>>('add-global-tokens'),

        forceUpdateNpmConfig: args.get<ReturnType<typeof optionalBooleanFlag>>('update-npm-config'),
        forceInstallNpmModules: args.get<ReturnType<typeof optionalBooleanFlag>>('install-npm-modules'),
        forceUseGlobalTokens: args.get<ReturnType<typeof optionalBooleanFlag>>('use-global-tokens'),

        skipVersionCheck: args.get<ReturnType<typeof booleanFlag>>('skip-version-check'),
        force: args.get<ReturnType<typeof booleanFlag>>('force'),
    }
}
