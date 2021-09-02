import { Arguments, ValueException } from "./packages/deno-arguments/mod.ts";
import { parse } from "https://deno.land/std/flags/mod.ts";
import { existsSync } from "https://deno.land/std/fs/mod.ts";
import { join, basename, dirname, isAbsolute } from "https://deno.land/std/path/mod.ts";


const successStyle = `
    color: #4caf50;
    font-weight: bold;
`;


const errorStyle = `
    color: #ff4646;
    font-weight: bold;
`;


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
    const args = new Arguments({
        name: 'config, c',
        description: `Cesta na konfugurační soubor s balíčky. Výchozí hodnota je "./packager.json"`,
        processor: (path: string | null): string => {
            if (path === null) throw new ValueException(`--config=${path}\nCesta na konfigurační soubor není platná.`);
            path = join(Deno.cwd(), path) as string;

            if (existsSync(path) === false) {
                throw new ValueException(`--config=${path}\nSoubor neexistuje.`);
            }

            try {
                JSON.parse(Deno.readTextFileSync(path));
            } catch (_err) {
                throw new ValueException(`JSON konfiguračního souboru je požkozený.`);
            }

            return path;
        },
        fallback: false
    }, {
        name: 'install, i',
        description: `Naistaluje balíčky z konfiguračního souboru.`,
        processor: (v: string | boolean) => v === true || v === 'true',
        fallback: false
    }, {
        name: 'delete, uninstall, clear, remove',
        description: `Smaže balíčky podle konfiguračního souboru.`,
        processor: (v: string | boolean) => v === true || v === 'true',
        fallback: false
    });

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
    const length = all.sort((a, b) => b.length - a.length)[0].length;

    return `${s} ${Array(length - s.length + 5 + 1).join('.')} `;
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
        console.log('%c'
            + `> ${padRight(name, names)}`
            + '%c'
            + `install ${success ? 'OK' : 'FAILED'}`,
            'font-weight: bold;',
            success ? successStyle : errorStyle
        );

        if (message.trim() !== '') {
            console.log(`>> ${message}`);
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


const deletePackage = (list: PackageListType, separateGitRoot: string) => {
    function printTask(name: string, names: string[], success: boolean, message: string) {
        console.log('%c'
            + `> ${padRight(name, names)}`
            + '%c'
            + `delete ${success ? 'OK' : 'FAILED'}`,
            'font-weight: bold;',
            success ? successStyle : errorStyle
        );

        if (message.trim() !== '') {
            console.log(`>> ${message}`);
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
    const separateGitRoot = join(root, './.packager');

    const configJson = Deno.readTextFileSync(args.config);
    const config = parseConfig(configJson, root, separateGitRoot);

    if (args.delete) {
        console.log('\n');

        const yes = 'y';
        const no = 'n';
        const decision = prompt(`Are you sure you want to delete? (${yes}/${no})`, 'n');

        if (decision === yes) await deletePackage(config, separateGitRoot);

        console.log('\n');
    }


    if (args.install) {
        console.log('\n');
        await installPackage(config, separateGitRoot);
        console.log('\n');
    }
}


export const main = async () => {
    try {
        await run();
    } catch (error) {
        if (!(Arguments.isArgumentException(error))) throw error;
    }
};


main();