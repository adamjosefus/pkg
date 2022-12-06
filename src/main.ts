import { Arguments } from "../libs/deno_x/allo_arguments.ts";
import { buildCommand } from "./commands/buildCommand.ts";
import { initCommand } from "./commands/initCommand.ts";
import { installCommand } from "./commands/installCommand.ts";
import { versionCommand } from "./commands/versionCommand.ts";
import { computeConfigFormat } from "./model/computeConfigFormat.ts";
import { createConfigLoader } from "./model/createConfigLoader.ts";
import { getArguments } from "./model/getArguments.ts";
import { computeLockFilePath } from "./model/computeLockFilePath.ts";
import { Watcher } from "./utils/Watcher.ts";
import { makeAbsolute } from "./utils/makeAbsolute.ts";
import { ensureLockFile } from "./model/ensureLockFile.ts";


const packager = async () => {
    const args = getArguments();

    if (args.version) {
        await versionCommand();
        return;
    }

    if (args.init) {
        await initCommand();
        return;
    }


    const root = args.root ? makeAbsolute(Deno.cwd(), args.root) : Deno.cwd();
    const configFile = makeAbsolute(root, args.config);
    const lockFile = computeLockFilePath(configFile);
    const configFormat = computeConfigFormat(configFile, args['config-format']);
    const loadConfig = createConfigLoader(configFile, configFormat, root);

    await ensureLockFile(lockFile);

    const action = async () => {
        const config = await loadConfig();
        if (args.install) await installCommand(root, config, lockFile);
        if (args.build) await buildCommand();
    }

    const superWatch = async () => {
        if (args.watch === 1) return true;
        if (args.watch === -1) return false;

        const config = await loadConfig();
        return config.watch;
    }

    await action();

    if (await superWatch()) {
        const config = await loadConfig();
        const watcher = new Watcher([configFile, lockFile, ...config.filesToWatch]);

        watcher.addEventListener("modify", async () => {
            await action();
        });
    }
}


export const main = async () => {
    try {
        await packager();
    } catch (error) {
        Arguments.rethrowUnprintableException(error);
    }
}