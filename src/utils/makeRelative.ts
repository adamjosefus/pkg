/**
 * @author Adam Josefus
 */

import { relative, normalize } from "../../libs/deno_std/path/mod.ts";
import { pipe } from "../../libs/esm/fp-ts/function.ts";


export const makeRelative = (root: string, path: string) => pipe(
    relative(root, path),
    normalize,
);


export const makeRelativeTo = (path: string) => (root: string) => makeRelative(root, path);
