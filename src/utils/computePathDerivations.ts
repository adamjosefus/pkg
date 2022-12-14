import { dirname } from "../../libs/deno_std/path/mod.ts";

/**
 * Compute all dirname of a path. Path it self is included.
 */
export const computePathDerivations = (path: string): string[] => {
    const derivate = (paths: string[]): string[] => {
        const path = paths.at(-1)!;

        const derivation = dirname(path);
        if (derivation === path) return paths;

        paths.push(derivation);
        return derivate(paths);
    }

    return derivate([path]);
}
