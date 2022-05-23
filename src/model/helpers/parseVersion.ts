/**
 * @copyright Copyright (c) 2022 Adam Josefus
 */

import { pipe } from "./pipe.ts";


/**
 * Parse version from string.
 * 
 * Expects a string like `v1.2.3` or `1.2.3-alpha.1`.
 */
export function parseVersion(version: string) {
    const raw = pipe<string>(
        s => s.trim(),
        s => s.startsWith('v') ? s.substring(1) : s,
    )(version);

    const [numbers, label] = raw.split('-');
    const [major, minor, patch] = numbers.split('.');

    return {
        major: parseInt(major ?? '0', 10),
        minor: parseInt(minor ?? '0', 10),
        patch: parseInt(patch ?? '0', 10),
        label: label ?? null
    }
}
