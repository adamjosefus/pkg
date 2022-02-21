/**
 * @copyright Copyright (c) 2022 Adam Josefus
 */


import { join, basename, isAbsolute } from "https://deno.land/std@0.126.0/path/mod.ts";
import { ConfigSchema } from "./ConfigSchema.ts";
import { ConfigType } from "./ConfigType.ts";


export function parseConfig(json: string, destinationRoot: string, separateGitRoot: string): ConfigType {
    const config: ConfigType = [];

    const data = JSON.parse(json) as ConfigSchema;

    const packages = data.packages ?? {};

    for (const reference in packages) {
        const options = (v => {
            if (typeof v  === "boolean") {
                return v ? {} : null
            } else {
                return v;
            }
        })(packages[reference]);

        if (options === null) break;


        const remoteName = basename(reference, '.git');
        
        const localName = options.name ?? remoteName;

        const destinationDir = (d => {
            const p = join(d, localName);
            return isAbsolute(p) ? p : join(destinationRoot, p);
        })(options.destination ?? './');

        const separatedGitDir = join(separateGitRoot, remoteName);

        const tag = options.tag ?? null;

        config.push({
            reference,
            displayReference: createDisplayReference(reference),
            tag,
            name: localName,
            destinationDir,
            separatedGitDir,
        });
    }

    return config;
}


function createDisplayReference(s: string): string {
    // TODO: Hide auth credentials
    return s;
}
