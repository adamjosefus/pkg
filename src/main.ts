import { Arguments } from "../libs/deno_x/allo_arguments.ts";
import { buildCommand } from "./commands/buildCommand.ts";
import { initCommand } from "./commands/initCommand.ts";
import { installCommand } from "./commands/installCommand.ts";
import { versionCommand } from "./commands/versionCommand.ts";
import { computeConfigFormat } from "./model/computeConfigFormat.ts";
import { createConfigLoader } from "./model/createConfigLoader.ts";
import { getArguments } from "./model/getArguments.ts";
import { Watcher } from "./utils/Watcher.ts";
import { makeAbsolute } from "./utils/makeAbsolute.ts";


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

    const configFile = makeAbsolute(args.root ?? Deno.cwd(), args.config);
    const configFormat = computeConfigFormat(configFile, args['config-format']);
    const forceWatch = args.watch;

    const loadConfig = createConfigLoader(configFile, configFormat);

    const action = async () => {
        const config = await loadConfig();

        if (args.install) await installCommand();
        if (args.build) await buildCommand();
    }

    const superWatch = async () => {
        if (forceWatch === 1) return true;
        if (forceWatch === -1) return false;

        const config = await loadConfig();
        return config.watch;
    }

    await action();

    if (await superWatch()) {
        const config = await loadConfig();
        const watcher = new Watcher([configFile, ...config.filesToWatch]);

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