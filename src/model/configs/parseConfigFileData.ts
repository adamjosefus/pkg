/**
 * @copyright Copyright (c) 2022 Adam Josefus
 */

import { currentVersion, lastSupportedVersion } from "../../dogma.ts";
import { ExpectedException } from "../../libs/allo_arguments.ts";
import { JSONC } from "../../libs/jsonc.ts";
import { parseVersion } from "../helpers/parseVersion.ts";
import { formatVersion } from "../helpers/formatVersion.ts";
import { ConfigFileSchemaType } from "./ConfigFileSchemaType.ts";


/**
 * Converts a version string to an array of numbers.
 */
function versionToArray(v: string) {
    const { major, minor, patch } = parseVersion(v);
    return [major, minor, patch];
}


/**
 * Checks if the config version is valid for the current program version.
 */
function hasConfigValidVersion(version: string, lastSupported: string): boolean {
    const configVersion = versionToArray(version);
    const lastSupportedVersion = versionToArray(lastSupported);

    const length = Math.max(configVersion.length, lastSupportedVersion.length);

    for (let i = 0; i < length; i++) {
        const conf = configVersion.at(i) ?? 0;
        const last = lastSupportedVersion.at(i) ?? 0;

        if (conf > last) return true;
        if (conf < last) return false;
    }

    return true;
}


/**
 * Checks if the program version is valid for the config version.
 */
function isProgramValidForVersion(version: string): boolean {
    const current = versionToArray(currentVersion);
    const config = versionToArray(version);

    const length = Math.max(current.length, config.length);
    for (let i = 0; i < length; i++) {
        const curr = current.at(i) ?? 0;
        const conf = config.at(i) ?? 0;

        if (conf <= curr) return true;
        if (conf > curr) return false;
    }

    return true;
}


/**
 * Parses the config file data.
 */
export function parseConfigFileData(path: string, checkVersion: boolean): ConfigFileSchemaType {
    const json = Deno.readTextFileSync(path);
    const data = JSONC.parse(json) as ConfigFileSchemaType;

    if (checkVersion) {
        if (data.version === undefined) {
            throw new ExpectedException(`No version specified in the config file.`);
        }

        if (!hasConfigValidVersion(data.version, lastSupportedVersion)) {
            throw new ExpectedException([
                `Unsupported config version: "${formatVersion(data.version)}"`,
                `Last Supported version: "${formatVersion(lastSupportedVersion)}"`,
                `Please update your config file.`,
            ].join('\n'));
        }

        if (!isProgramValidForVersion(data.version ?? '')) {
            throw new ExpectedException([
                `Unsupported PKG version: "${formatVersion(currentVersion)}"`,
                `Config version: "${formatVersion(data.version)}"`,
                `Please update your PKG.`,
            ].join('\n'));
        }
    }

    return data;
}
