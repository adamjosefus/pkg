import { Version } from "../types.ts";


export function serializeVerionTypeDeclaration(version: Version<number>): string {
    const { major, minor, patch, flag } = version;
    const current = `${major}.${minor}.${patch}${flag ? `-${flag}` : ``}`;
    const common = `${major}.\${number}.\${number}`;
    
    const variants = [
        `${current}`,
        `${common}`,
        `${common}-\${string}`,
    ]

    return variants.map(v => `\`${v.replaceAll('`', '\\`')}\``).join(` | `);
}
