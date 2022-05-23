/**
 * @copyright Copyright (c) 2022 Adam Josefus
 */

import { ExpectedException } from "../../libs/allo_arguments.ts";
import { detectConfigPath } from "./detectConfigPath.ts";


/**
 * Returns the path of the configuration file.
 * 
 * @param dir 
 * @returns 
 */
export function configPath(dir: string): string {
    const path = detectConfigPath(dir);

    if (path === null) throw new ExpectedException(`The config file is not found.`);

    return path;
}
