import os from "https://deno.land/x/dos/mod.ts";
import { join } from "https://deno.land/std@0.106.0/path/mod.ts";


const platform = os.platform() === 'darwin' ? 'mac' : os.platform();

const name = `pkg_${platform}`;
const path = join(Deno.cwd(), name);

const cwd = [
    `deno`,
    `--unstable`,
    `compile`,
    `--output=${name}`,
    `--allow-all`,
    `./main.ts`
];

console.log("\n");
console.log("Path:", path);
console.log(cwd.join(' '));
console.log("\n");

await Deno.run({
    cmd: cwd,
    stdout: 'piped',
    stderr: 'piped',
})