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


class ExpectedError extends Error {
    constructor(message: string) {
        console.log('\n\n');
        message.split('\n').map(l => {
            console.log(`%c >> %c ${l}`, 'color: yellow', errorStyle);
        });
        console.log('\n\n');

        super(message);
    }
}


const getArguments = () => {
    function processConfig(path: string | null): string {
        if (path === null) throw new ExpectedError(`--config=${path}\nCesta na konfigurační soubor není platná.`);

        path = join(Deno.cwd(), path) as string;

        if (existsSync(path) === false) throw new ExpectedError(`--config=${path}\nSoubor neexistuje.`);

        try {
            JSON.parse(Deno.readTextFileSync(path));
        } catch (_err) {
            throw new ExpectedError(`JSON konfiguračního souboru je požkozený.`);
        }

        return path;
    }

    const args = parse(Deno.args);

    return {
        install: args.install === true,
        config: processConfig(args.config ?? './packager.json'),
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
            + `clone ${success ? 'OK' : 'FAILED'}`,
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


const main = async () => {
    const args = getArguments();

    const root = dirname(args.config);
    const separateGitRoot = join(root, './.packager');

    const configJson = Deno.readTextFileSync(args.config);
    const config = parseConfig(configJson, root, separateGitRoot);

    if (args.install) {
        console.log('\n');
        await installPackage(config, separateGitRoot);
        console.log('\n');
    }
}


try {
    main();
} catch (error) {
    if (!(error instanceof ExpectedError)) throw error;
}