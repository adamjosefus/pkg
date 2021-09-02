import { parse } from "https://deno.land/std/flags/mod.ts";
import { existsSync } from "https://deno.land/std/fs/mod.ts";
import { join, basename, dirname, isAbsolute } from "https://deno.land/std/path/mod.ts";


const successStyle = `
    color: #4caf50;
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

    function processRoot(path: string | null): string {
        if (path === null) throw new ExpectedError(`--root=${path}\nCesta na složku kontejnerů není platná.`);

        path = join(Deno.cwd(), path) as string;

        if (existsSync(path) === false) throw new ExpectedError(`--root=${path}\nSložka neexistuje.`);

        return path;
    }

    const args = parse(Deno.args);

    return {
        clone: args.clone === true,
        pull: args.pull === true,
        config: processConfig(args.config ?? './packager.json'),
    }
}


const parseConfig = (json: string, root: string): PackageListType => {
    const list: PackageListType = [];
    const data = JSON.parse(json) as ConfigFileType;

    for (const repository in data) {
        const value = data[repository];
        if (value === false) break;
        const options = value === true ? {} : value;

        const name = options.name ?? basename(repository, '.git');

        const path = (d => {
            const p = join(d, name);

            return isAbsolute(p) ? p : join(root, p);
        })(options.dest ?? './');

        const branch = options.branch ?? null;

        list.push({
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

    const output = await(async (ok) => {
        if (ok) return await process.output()
        else return await process.stderrOutput()
    })(status.success);

    const decoder = new TextDecoder();

    return {
        success: status.success,
        message: decoder.decode(output)
    }
}


const clone = async (config: PackageListType) => {
    function createTask(path: string, reference: string, branch: string | null) {
        const task: string[] = [];

        task.push('git', 'clone');
        task.push('--depth', '1');

        if (branch) {
            task.push('--branch', branch);
        }

        task.push(reference);
        task.push(path);
        task.push('--single-branch');

        return task;
    }


    // Run tasks
    for (const item of config) {
        const cmd = createTask(item.path, item.repository, item.branch);
        const p = await runCommand(...cmd);

        if (p.success) {
            console.log('%c' + `> ${item.name}: Clone OK`, successStyle);
            if (p.message.trim() !== '') console.log(`> ${p.message}`);

        } else {
            console.log('%c' + `> ${item.name}: Clone Failed`, errorStyle);
            console.log(`> ${p.message}\n`);
        }
    }
}


const pull = async (config: PackageListType) => {
    function createTask(path: string) {
        const task: string[] = [];

        task.push('git');
        task.push('-C', path);
        task.push('pull');

        return task;
    }


    // Run tasks
    for (const item of config) {
        const cmd = createTask(item.path);
        const p = await runCommand(...cmd);

        if (p.success) {
            console.log('%c' + `> ${item.name}: Pull OK`, successStyle);
            if (p.message.trim() !== '') console.log(`> ${p.message}`);

        } else {
            console.log('%c' + `> ${item.name}: Pull Failed`, errorStyle);
            console.log(`> ${p.message}`);
        }
    }
}


const main = async () => {
    const args = getArguments();

    const configJson = Deno.readTextFileSync(args.config);
    const config = parseConfig(configJson, dirname(args.config));

    if (args.clone) await clone(config);
    if (args.pull) await pull(config);
}


try {
    main();
} catch (error) {
    if (!(error instanceof ExpectedError)) throw error;
}