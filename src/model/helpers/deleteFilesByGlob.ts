/**
 * @copyright Copyright (c) 2022 Adam Josefus
 */

import { expandGlob } from "../../libs/fs.ts";
import { join, relative } from "../../libs/path.ts";
import { existsSync } from "./existsSync.ts";


/**
 * Delete all files or directories by glob.
 * 
 * @param root The root directory
 * @param glob The glob to delete
 */
export async function deleteFilesByGlob(root: string, glob: string) {
    const entries = expandGlob(glob, { root, globstar: true, exclude: [root] });
    const paths: string[] = [];

    for await (const entry of entries) {
        const p = relative(root, entry.path);
        // Skip files that are not in the root directory
        if (p.startsWith("..")) continue;

        // Add valid path to list
        paths.push(p);
    }

    const promises = paths.map(p => {
        const path = join(root, p);
        if (!existsSync(path)) return;

        // Delete file
        return Deno.remove(path, { recursive: true });
    });

    await Promise.all(promises);
}
