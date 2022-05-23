/**
 * @copyright Copyright (c) 2022 Adam Josefus
 */

import { existsSync } from "../helpers/existsSync.ts";
import { type NpmConfigType } from "./NpmConfigType.ts";
import { computeNpmConfigPath } from "./computeNpmConfigPath.ts";

/**
 * Load package.json from a directory.
 */
export async function loadNpmConfigFrom(dir: string): Promise<NpmConfigType | null> {
    const path = computeNpmConfigPath(dir);
    if (!existsSync(path)) return null;

    try {
        const json = await Deno.readTextFile(path);
        return JSON.parse(json) as NpmConfigType;
    } catch (_err) {
        return null;
    }
}
