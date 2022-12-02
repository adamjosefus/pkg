/**
 * @author Adam Josefus
 */

import { Version } from "../types.ts"


export function formatVersion({ major, minor, patch, flag }: Version<number>): string {
    return `v${major}.${minor}.${patch}` + (flag ? `-${flag}` : '')
}
