/**
 * @copyright Copyright (c) 2022 Adam Josefus
 */

import { computeAllConfigPaths } from "./computeAllConfigPaths.ts";
import { existsSync } from "../helpers/existsSync.ts";


/**
 * Returns the path of the configuration file.
 * 
 * @param dir The directory to search for the configuration file.
 * @returns 
 */
export function detectConfigPath(dir: string): string | null {
    const paths = computeAllConfigPaths(dir);

    const path = paths.find(p => existsSync(p));
    return path ?? null;
}
