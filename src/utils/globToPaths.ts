import * as fs from "../../libs/deno_std/fs/mod.ts";
import { join, relative } from "../../libs/deno_std/path/mod.ts";
import { createAsyncFunction } from "./createAsyncFunction.ts";
import { existsSync } from "./exists.ts";


export interface Options {
    root: string,
    exclude?: string[],
    includeDirs?: boolean,
    extended?: boolean,
    globstar?: boolean,
    caseInsensitive?: boolean,
    /**
     * Remove all relative paths which are outside of the root directory.
     */
    onlyInsiders?: boolean,
    /**
     * Remove all paths which are not existing on the file system.
     */
    onlyExists?: boolean,
}


export const globToPathsSync = (glob: string, options: Options) => {
    const entries = fs.expandGlobSync(glob, { ...options });
    const paths: string[] = [];

    for (const entry of entries) {
        const path = relative(options.root, entry.path);
        if (options.onlyInsiders && path.startsWith("..")) continue;
        
        const absolute = join(options.root, path);
        if (options.onlyExists && !existsSync(absolute)) continue;

        paths.push(path);
    }

    return paths;
}


export const globToPaths = createAsyncFunction(globToPathsSync);
