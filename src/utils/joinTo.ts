/**
 * @author Adam Josefus
 */

import { join, normalize } from "../../libs/deno_std/path/mod.ts";


/**
 * If the path is not absolute, make it absolute to the root directory.
 */
export const joinTo = (path: string) => (destination: string) => {
    return normalize(join(destination, path));
}
