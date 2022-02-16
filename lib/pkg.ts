/**
 * @copyright Copyright (c) 2022 Adam Josefus
 */

import { join, basename, dirname, isAbsolute } from "https://deno.land/std@0.125.0/path/mod.ts";
import { green, red, gray, bold } from "https://deno.land/std@0.125.0/fmt/colors.ts";
import { Arguments, ValueException } from "https://deno.land/x/allo_arguments@v4.0.1/mod.ts";
import { existsSync } from "./exists.ts";


const successStyle = (s: string) => green(bold(s));
const errorStyle = (s: string) => red(bold(s));


type ConfigFileType = {
    [repository: string]: {
        name?: string,
        dest?: string,
        branch?: string,
    } | boolean,
}


type PackageListType = Array<{
    git: string,
    name: string,
    path: string,
    repository: string,
    branch: string | null,
}>


const getArguments = () => {
    const args = new Arguments(
        {
            name: 'config, c',
            description: `Path to the package configuration file. The default value is "./pkg.json"`,
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
            name: 'delete, uninstall, clear, remove',
            description: `Deletes packages according to the configuration file.`,
            convertor: (v: string | boolean) => v === true || v === 'true',
            default: false
        }
    );


    if (args.shouldHelp()) {
        args.triggerHelpException();
    }

    return {
        delete: args.get<boolean>('delete'),
        install: args.get<boolean>('install'),
        config: args.get<string>('config'),
    }
}


const parseConfig = (json: string, root: string, separateGitRoot: string): PackageListType => {
    const list: PackageListType = [];
    const data = JSON.parse(json) as ConfigFileType;

    for (const repository in data) {
        const value = data[repository];
        if (value === false) break;
        const options = value === true ? {} : value;

        const originalName = basename(repository, '.git');
        const name = options.name ?? originalName;

        const path = (d => {
            const p = join(d, name);

            return isAbsolute(p) ? p : join(root, p);
        })(options.dest ?? './');

        const branch = options.branch ?? null;

        list.push({
            git: join(separateGitRoot, originalName),
            name,
            path,
            repository,
            branch,
        });
    }

    return list;
}


// deno-lint-ignore no-explicit-any
const runCommand = async (...cmd: any[]) => {
    const process = Deno.run({
        cmd,
        stdout: "piped",
        stderr: "piped",
    });

    const status = await process.status();

    const output = await (async (ok) => {
        if (ok) return await process.output()
        else return await process.stderrOutput()
    })(status.success);

    const decoder = new TextDecoder();

    return {
        success: status.success,
        message: decoder.decode(output)
    }
}


function padRight(s: string, all: string[]): string {
    const length = all.reduce((a, b) => Math.max(a, b.length), 0) + 5;

    return s.padEnd(length, '.');
}


const installPackage = async (list: PackageListType, separateGitRoot: string) => {
    function createTask(git: string, path: string, reference: string, branch: string | null) {
        const task: string[] = [];

        task.push('git', 'clone');
        task.push('--depth', '1');

        if (branch) {
            task.push('--branch', branch);
        }

        task.push('--separate-git-dir', git);

        task.push(reference);
        task.push(path);
        task.push('--single-branch');

        return task;
    }


    function printTask(name: string, names: string[], success: boolean, message: string) {
        console.log([
            `> ${padRight(name, names)}`,
            success ? successStyle('install OK') : errorStyle('install FAILED'),
        ].join(''));

        if (message.trim() !== '') {
            console.log(gray(`>> ${message}`));
        }
    }

    Deno.mkdirSync(separateGitRoot);

    // Run tasks
    for (const item of list) {
        const cmd = createTask(item.git, item.path, item.repository, item.branch);
        const p = await runCommand(...cmd);

        printTask(item.repository, list.map(x => x.repository), p.success, p.message);
    }

    Deno.removeSync(separateGitRoot, { recursive: true });
}


const deletePackage = (list: PackageListType) => {
    function printTask(name: string, names: string[], success: boolean, message: string) {
        console.log([
            `> ${padRight(name, names)}`,
            success ? successStyle('delete OK') : errorStyle('delete FAILED'),
        ].join(''));

        if (message.trim() !== '') {
            console.log(gray(`>> ${message}`));
        }
    }

    // Run tasks
    for (const item of list) {
        let success: boolean;
        let message: string;

        try {
            Deno.removeSync(item.path, { recursive: true });
            success = true;
            message = '';
        } catch (error) {
            success = false;
            message = error.toString();
        }

        printTask(item.repository, list.map(x => x.repository), success, message);
    }
}


const run = async () => {
    const args = getArguments();

    const root = dirname(args.config);
    const separateGitRoot = join(root, './.pkg');

    const configJson = Deno.readTextFileSync(args.config);
    const config = parseConfig(configJson, root, separateGitRoot);

    if (args.delete) {
        console.log('\n');

        const yes = 'y';
        const no = 'n';
        const decision = prompt(`Are you sure you want to delete? (${yes}/${no})`, 'n');

        if (decision === yes) await deletePackage(config);

        console.log('\n');
    }


    if (args.install) {
        console.log('\n');
        await installPackage(config, separateGitRoot);
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
