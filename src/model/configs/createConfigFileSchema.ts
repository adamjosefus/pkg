/**
 * @copyright Copyright (c) 2022 Adam Josefus
 */

import { ConfigFileSchemaType } from "./ConfigFileSchemaType.ts";
import { currentVersion } from "../../dogma.ts";


export function createConfigFileSchema(): Required<ConfigFileSchemaType<typeof currentVersion>> {
    return {
        version: currentVersion,
        destination: "./dependencies",
        repositories: {},
        tokens: {},
        ignore: [],
        options: {
            updateNpmConfig: true,
            installNpmModules: true,
            useGlobalTokens: true,
        }
    }
}
