/**
 * @copyright Copyright (c) 2022 Adam Josefus
 */

import { Arguments } from "./libs/allo_arguments.ts";
import { loadConfigFrom } from "./model/configs/mod.ts";
import { init } from "./commands/init.ts";
import { install } from "./commands/install.ts";
import { uninstall } from "./commands/uninstall.ts";
import { deleteDestinations } from "./commands/deleteDestinations.ts";
import { addGlobalTokens } from "./commands/addGlobalTokens.ts";
import { getArguments } from "./getArguments.ts";


const main = async () => {
    const root = Deno.cwd();
    const args = getArguments(root);

    const needConfirmation = !args.force;
    const checkConfigVersion = !args.skipVersionCheck;
    const forceUseGlobalTokens = !args.forceUseGlobalTokens;

    // Init config file
    if (args.init) {
        await init(root, args.init);
        Deno.exit(0);
    }

    // Save global tokens
    if (args.addGlobalTokens.length > 0) {
        await addGlobalTokens(root, args.addGlobalTokens);
        Deno.exit(0);
    }

    // Load config file
    const config = await loadConfigFrom(root, args.tokens, {
        useGlobalTokens: forceUseGlobalTokens,
        checkVersion: checkConfigVersion,
    });

    // Delete destinations by config
    if (args.uninstall) {
        await uninstall(root, config, needConfirmation);
    }

    // Delete destinations of all dependencies
    if (args.deleteDestinations) {
        await deleteDestinations(root, config, needConfirmation);
    }

    // Install dependencies
    if (args.install) {
        await install(root, config, config.tokens, {
            forceUpdateNpmConfig: args.forceUpdateNpmConfig,
            forceInstallNpmModules: args.forceInstallNpmModules,
            checkConfigVersion: checkConfigVersion,
        });
    }
}


export const run = async () => {
    try {
        await main();
    } catch (error) {
        Arguments.rethrowUnprintableException(error);
    }
};
