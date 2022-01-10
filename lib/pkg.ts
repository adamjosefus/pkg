import { Arguments, ValueException } from "./packages/deno-arguments/mod.ts";
import { Color, Style } from "./packages/deno-ascii-office/mod.ts";
import { existsSync } from "./exists.ts";
import { join, basename, dirname, isAbsolute } from "https://deno.land/std@0.120.0/path/mod.ts";


const successStyle = (s: string) => Color.green(Style.bold(s));
const errorStyle = (s: string) => Color.red(Style.bold(s));


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
            description: `Cesta na konfugurační soubor s balíčky. Výchozí hodnota je "./pkg.json"`,
            processor: (path: string | null | false): string => {
                if (path === null || path === false) throw new ValueException(`Cesta na konfigurační soubor není platná.`);
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
            fallback: "pkg.json"
        },
        {
            name: 'install, i',
            description: `Naistaluje balíčky z konfiguračního souboru.`,
            processor: (v: string | boolean) => v === true || v === 'true',
            fallback: false
        },
        {
            name: 'delete, uninstall, clear, remove',
            description: `Smaže balíčky podle konfiguračního souboru.`,
            processor: (v: string | boolean) => v === true || v === 'true',
            fallback: false
        }
    );

    args.setDescription('Verze: 1.1.3');


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
            console.log(Color.gray(`>> ${message}`));
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
            console.log(Color.gray(`>> ${message}`));
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
