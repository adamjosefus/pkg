/**
 * @copyright Copyright (c) 2022 Adam Josefus
 */


import { join, dirname } from "https://deno.land/std@0.126.0/path/mod.ts";
import { Arguments, ValueException } from "https://deno.land/x/allo_arguments@v4.0.1/mod.ts";
import { existsSync } from "./helpers/exists.ts";
import { parseConfig } from "./model/parseConfig.ts";
import { installPackages } from "./model/installPackages.ts";
import { deletePackages } from "./model/deletePackages.ts";


const getArguments = () => {
    const args = new Arguments(
        {
            name: 'config, c',
            description: `Path to the package configuration file.`,
            convertor: (path: string | null | false): string => {
                if (path === null || path === false) throw new ValueException(`Cesta na konfigurační soubor není platná.`);
                path = join(Deno.cwd(), path) as string;

                if (existsSync(path) === false) {
                    throw new ValueException(`--config=${path}\nThe file does not exist.`);
                }

                try {
                    JSON.parse(Deno.readTextFileSync(path));
                } catch (_err) {
                    throw new ValueException(`The JSON of the configuration file is corrupted.`);
                }

                return path;
            },
            default: "pkg.json"
        },
        {
            name: 'install, i',
            description: `Installs packages from the configuration file.`,
            convertor: (v: string | boolean) => v === true || v === 'true',
            default: false
        },
        {
            name: 'delete, uninstall',
            description: `Deletes packages according to the configuration file.`,
            convertor: (v: string | boolean) => v === true || v === 'true',
            default: false
        },
        {
            name: 'force',
            description: `If true, the script will not ask for confirmation.`,
            convertor: (v: string | boolean) => v === true || v === 'true',
            default: false
        }
    );

    if (args.shouldHelp()) {
        args.triggerHelpException();
    }

    return {
        config: args.get<string>('config'),
        delete: args.get<boolean>('delete'),
        install: args.get<boolean>('install'),
        force: args.get<boolean>('force'),
    }
}


const run = async () => {
    const args = getArguments();

    const configRoot = dirname(args.config);
    const separateGitRoot = join(configRoot, './.pkg');

    const configJson = Deno.readTextFileSync(args.config);
    const config = parseConfig(configJson, configRoot, separateGitRoot);

    if (args.delete) {
        console.log('\n');

        let confirmation = false;
        if (!args.force) {
            const yes = 'y';
            const no = 'n';

            confirmation = prompt(`Are you sure you want to delete? (${yes}/${no})`, 'n') === yes;
        }

        if (confirmation || args.force) await deletePackages(config);

        console.log('\n');
    }


    if (args.install) {
        console.log('\n');
        await installPackages(config, separateGitRoot);
        console.log('\n');
    }
}


export const pkg = async () => {
    try {
        await run();
    } catch (error) {
        if (!(Arguments.isArgumentException(error))) throw error;
    }
};
