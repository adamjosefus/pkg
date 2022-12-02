import { pipe } from "../../libs/esm/fp-ts/function.ts";
import { Version } from "../types.ts";


/**
 * Parse version from string.
 * 
 * Expects a string like `v1.2.3` or `1.2.3-alpha.1`.
 */
export function parseVersion(version: string): Version<number> {
    const raw = pipe(
        version,
        s => s.trim(),
        s => s.startsWith('v') ? s.substring(1) : s,
    );

    const [numbers, flag] = raw.split('-') as [string, string?];
    const [major, minor, patch] = numbers.split('.') as [string, string?, string?];

    return {
        major: parseInt(major ?? '0', 10),
        minor: parseInt(minor ?? '0', 10),
        patch: parseInt(patch ?? '0', 10),
        flag: flag ?? undefined
    }
}
