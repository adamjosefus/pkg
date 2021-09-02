import { parse } from "https://deno.land/std/flags/mod.ts";
import { existsSync } from "https://deno.land/std/fs/mod.ts";
import { join as joinPath, basename } from "https://deno.land/std/path/mod.ts";


const successStyle = `
    color: #4caf50;
`;


const errorStyle = `
    color: #ff4646;
    font-weight: bold;
`;


type ConfigFileType = {
    [repository: string]: {
        
    }
}


type ConfigType = Array<{
    name: string,
    destination: string,
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

        path = joinPath(Deno.cwd(), path) as string;

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

        path = joinPath(Deno.cwd(), path) as string;

        if (existsSync(path) === false) throw new ExpectedError(`--root=${path}\nSložka neexistuje.`);

        return path;
    }

    const args = parse(Deno.args);

    return {
        clone: args.clone === true,
        pull: args.pull === true,
        configPath: processConfig(args.config ?? null),
        root: processRoot(args.root ?? args['container-root'] ?? null),
    }
}


const parseConfig = (json: string): ConfigType => {
    const config: ConfigType = [];
    const raw = JSON.parse(json) as ConfigFileType;

    for (const destination in raw) {
        const value = raw[destination];

        let repository: string;
        let branch: string | null;

        if (typeof value === 'string') {
            repository = value;
            branch = null;
        } else {
            repository = value[0];
            branch = value[1] ?? null;
        }

        config.push({
            name: basename(repository, '.git'),
            destination: destination,
            repository: repository,
            branch: branch,
        });
    }

    return config;
}


const clone = async (config: ConfigType, root: string) => {
    function createTask(dest: string, reference: string, branch: string | null) {
        const task: string[] = [];

        task.push('git', 'clone');
        task.push('--depth', '1');

        if (branch) {
            task.push('--branch', branch);
        }

        task.push(reference);
        task.push(dest);
        task.push('--single-branch');

        return task;
    }


    // Run tasks
    for (const item of config) {
        const cmd = createTask(
            joinPath(root, item.destination),
            item.repository,
            item.branch);

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
        const message = decoder.decode(output);

        if (status.success) {
            console.log('%c' + `> ${item.name}: Clone OK`, successStyle);
            if (message.trim() !== '') console.log(`> ${message}`);
            
        } else {
            console.log('%c' + `> ${item.name}: Clone Failed`, errorStyle);
            console.log(`> ${message}`);
        }
    }


    // Git ignore
    const gitIgnoreContent = ([
        '# Tento soubor je generovaný. Manuálně ho neupravujte.',
        ...config.map(item => item.destination),
    ]).join('\n');

    Deno.writeTextFileSync(
        joinPath(root, '.gitignore'),
        gitIgnoreContent,
        { append: false, create: true }
    );
}


const pull = async (config: ConfigType, root: string) => {
    function createTask(dest: string) {
        const task: string[] = [];

        task.push('git');
        task.push('-C', dest);
        task.push('pull');

        return task;
    }


    // Run tasks
    for (const item of config) {
        const cmd = createTask(joinPath(root, item.destination));

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
        const message = decoder.decode(output);

        if (status.success) {
            console.log('%c' + `> ${item.name}: Pull OK`, successStyle);
            if (message.trim() !== '') console.log(`> ${message}`);
            
        } else {
            console.log('%c' + `> ${item.name}: Pull Failed`, errorStyle);
            console.log(`> ${message}`);
        }
    }
}


const main = async () => {
    const args = getArguments();

    const configJson = Deno.readTextFileSync(args.configPath);
    const config = parseConfig(configJson);

    if (args.clone) {
        await clone(config, args.root);
    }

    if (args.pull) {
        await pull(config, args.root);
    }
}


try {
    main();
} catch (error) {
    if (!(error instanceof ExpectedError)) throw error;
}