/**
 * @author Adam Josefus
 */

import { Arguments } from "../../libs/deno_x/allo_arguments.ts"


export function getArguments() {
    const args = new Arguments({
        ...Arguments.createHelpOptions(),
        'version': {
            shortName: 'v',
            description: 'Print version and exit',
            convertor: Arguments.booleanConvertor,
            default: () => false,
        },
        'init': {
            description: 'Creates a new configuration file.',
            convertor: Arguments.booleanConvertor,
            default: () => false,
        },
        'root': {
            shortName: 'r',
            description: 'Root directory for executing commands.',
            convertor: Arguments.stringConvertor,
        },
        'watch': {
            shortName: 'w',
            description: 'Watch for changes and rebuild.',
            convertor: (v) => {
                const b = Arguments.booleanConvertor(v);

                if (b === true) return 1 as const;
                if (b === false) return -1 as const;

                return 0 as const;
            },
        },
        'config': {
            shortName: 'c',
            description: [
                'Path to config file.',
                'Valid formats are: .json, .jsonc, .ts, .js, .mts, .mjs',
            ].join('\n'),
            convertor: Arguments.stringConvertor,
            default: () => 'packager.jsonc',
        },
        'config-format': {
            shortName: 'f',
            description: [
                'Force config file format.',
                'Useful for config files without extensions.',
                'Valid formats are: "json", "jsonc", "ts", "js", "mts", "mjs"',
            ].join('\n'),
            convertor: Arguments.stringConvertor,
        },
        'install': {
            shortName: 'i',
            description: 'Install dependencies declared in config file.',
            convertor: Arguments.booleanConvertor,
            default: () => false,
        },
        'build': {
            shortName: 'b',
            description: 'Build the project.',
            convertor: Arguments.booleanConvertor,
            default: () => false,
        },
    });

    args.setDescription(`Packager is a tool for installing dependencies and building projects.`)

    // Important for `--help` flag works.
    if (args.isHelpRequested()) args.triggerHelp();

    return args.getFlags();


    // return {
    //     install,
    //     tokens: args.get<ReturnType<typeof tokensFlag>>('tokens'),

    //     init: args.get<ReturnType<typeof initFlag>>('init'),
    //     addGlobalTokens: args.get<ReturnType<typeof tokensFlag>>('add-global-tokens'),

    //     forceUpdateNpmConfig: args.get<ReturnType<typeof optionalBooleanFlag>>('update-npm-config'),
    //     forceInstallNpmModules: args.get<ReturnType<typeof optionalBooleanFlag>>('install-npm-modules'),
    //     forceUseGlobalTokens: args.get<ReturnType<typeof optionalBooleanFlag>>('use-global-tokens'),

    //     skipVersionCheck: args.get<ReturnType<typeof booleanFlag>>('skip-version-check'),
    //     force: args.get<ReturnType<typeof booleanFlag>>('force'),
    // }
}
