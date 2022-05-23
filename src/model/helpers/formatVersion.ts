/**
 * @copyright Copyright (c) 2022 Adam Josefus
 */

import { parseVersion } from "./parseVersion.ts";


export function formatVersion(version: string): string {
    const { major, minor, patch, label } = parseVersion(version);

    return `v${major}.${minor}.${patch}` + (label ? `-${label}` : '');
}
