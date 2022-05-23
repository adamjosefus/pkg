/**
 * @copyright Copyright (c) 2022 Adam Josefus
 */

import { join } from "../../libs/path.ts";
import { configName, allConfigExtensions } from "../../dogma.ts";


/**
 * Returns all possible paths to the configuration file.
 * 
 * @param dir The directory to compute the paths.
 * @returns 
 */
export function computeAllConfigPaths(dir: string): string[] {
    return Object.values(allConfigExtensions).map(ext => {
        return join(dir, `${configName}${ext}`);
    });
}
