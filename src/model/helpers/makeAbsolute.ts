/**
 * @copyright Copyright (c) 2022 Adam Josefus
 */

import { join, isAbsolute } from "https://deno.land/std@0.138.0/path/mod.ts";


/**
 * If the path is not absolute, make it absolute to the root directory.
 */
export function makeAbsolute(path: string, root: string): string {
    if (isAbsolute(path)) return path;
    return join(root, path);
}