import { dirname } from "../../libs/deno_std/path/mod.ts";
import { basenameWithoutExtension } from "../utils/basenameWithoutExtension.ts";


export const computeLockFilePath = (configFile: string) => {
    const dir = dirname(configFile);
    const name = basenameWithoutExtension(configFile);
    const ext = ".lock";

    return `${dir}/${name}${ext}`;
}
