import * as path from "../../libs/deno_std/path/mod.ts";


export type ConfigFormat = 'jsonc' | 'esm';


const normalizeConfigFormat = (format: string | undefined): ConfigFormat | undefined => {
    const s = format?.toLowerCase().trim().replace(/^\./g, '') ?? ''; // Remove leading dot

    if (['json', 'jsonc'].includes(s)) return 'jsonc';
    if (['ts', 'js', 'mts', 'mjs'].includes(s)) return 'esm';

    return undefined;
}


/**
 * Compute config file format. If `forceConfigFormat` is provided, it will be used. Default is `jsonc`.
 * Example:
 * - `"config.json"` → `"jsonc"`
 * - `"config.ts"` → `"esm"`
 * - `"config"` → `"jsonc"`
 * - `undefined` → `"jsonc"`
 * 
 * @param configFile File path to config file. From extension, we can guess the format.
 * @param forceConfigFormat Force config file format. Useful for config files without extensions.
 * @returns 
 */
export const computeConfigFormat = (configFile: string, forceConfigFormat: string | undefined): ConfigFormat => {
    const ext = path.extname(configFile);

    return normalizeConfigFormat(forceConfigFormat ?? ext) ?? 'jsonc';
}
