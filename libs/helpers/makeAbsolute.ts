/**
 * @copyright Copyright (c) 2022 Adam Josefus
 */


import { join, isAbsolute } from "https://deno.land/std@0.126.0/path/mod.ts";


export function makeAbsolute(root: string, path: string): string {
    if (isAbsolute(path)) {
        return path;
    }

    return join(root, path);
}