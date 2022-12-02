/**
 * @author Adam Josefus
 */

import { relative, normalize } from "../../libs/deno_std/path/mod.ts";


/**
 * If the path is not absolute, make it absolute to the root directory.
 */
export const makeRelative = (root: string, path: string) => {
    return normalize(relative(root, path));
}


export const makeRelativeTo = (path: string) => (root: string) => makeRelative(root, path);
