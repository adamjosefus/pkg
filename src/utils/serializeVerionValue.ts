import { Version } from "../types.ts";

export function serializeVerionValue(version: Version<number>): string {
    const { major, minor, patch, flag } = version;
    return `${major}.${minor}.${patch}${flag ? `-${flag}` : ""}`;
}
