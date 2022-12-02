import { basename, extname } from "../../libs/deno_std/path/mod.ts";

/**
 * Removes the extension from a file path.
 */
export const basenameWithoutExtension = (path: string): string => {
    const ext = extname(path);
    return basename(path, ext);
}
