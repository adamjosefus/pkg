/**
 * @copyright Copyright (c) 2022 Adam Josefus
 */

import { detectConfigPath } from "./detectConfigPath.ts";


/**
 * Returns `true` if the configuration file exists.
 * 
 * @param dir 
 * @returns 
 */
export function configPathExist(dir: string): boolean {
    const path = detectConfigPath(dir);

    return path !== null;
}
