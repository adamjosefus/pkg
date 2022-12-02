/**
 * @author Adam Josefus
 */

import { join, normalize, isAbsolute } from "../../libs/deno_std/path/mod.ts";


/**
 * If the path is not absolute, make it absolute to the root directory.
 */
export const makeAbsolute = (root: string, path: string) => {
    if (isAbsolute(path)) return path;

    return normalize(join(root, path));
}


export const makeAbsoluteTo = (path: string) => (root: string) => makeAbsolute(path, root);
