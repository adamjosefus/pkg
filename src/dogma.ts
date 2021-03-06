/**
 * @copyright Copyright (c) 2022 Adam Josefus
 */

import { MapValueType } from "./model/MapValueType.ts";

/**
 * Name of the configuration file. (Without extension)
 */
export const configName = "dependencies";


/**
 * Extensions of the configuration file. (With leading dot)
 */
const ConfigExtension = {
    JSONC: ".jsonc" as const,
    JSON: ".json" as const,
}

export type ConfigExtensionType = MapValueType<typeof ConfigExtension>;
export const allConfigExtensions = Object.values(ConfigExtension);


/**
 * Current version of this program.
 */
export const currentVersion = "3.0.0";


/**
 * Last supported version of configuration file which is supported by this program.
 */
export const lastSupportedVersion = "3.0.0";
