import { relative } from "../../libs/deno_std/path/mod.ts";
import { TransformedConfig } from "../types/TransformedConfig.ts";
import { exec } from "../utils/exec.ts";
import * as render from "../utils/render.ts";


export const installCommand = (config: TransformedConfig) => {
    // const clearLine = "\x1b[2K\r";
//     setInterval(() => {
//         Deno.stdout.write(new TextEncoder().encode("X"));
//     }, 200);

//     setInterval(() => {
//         Deno.stdout.writeSync(new TextEncoder().encode(clearLine));
//     }, 2000);
// });

    const list = config.dependencies.map(dependency => {
        return dependency.reference;
    });

    console.log(render.list(list));
    
}