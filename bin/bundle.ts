import { join } from "https://deno.land/std@0.117.0/path/mod.ts";


const name = 'pkg.bundled.js';
const path = join(Deno.cwd(), name);

const cmd = [
    `deno`,
    `bundle`,
    `./main.ts`,
    `./${name}`
];

console.log("\n");
console.log(`Bundle to %c${path}`, "font-weight: bold;");
console.log(`%c> ${cmd.join(' ')}`, "color: grey");

const process = await Deno.run({
    cmd: cmd,
    stdout: 'piped',
    stderr: 'piped',
})

const { success } = await process.status();

if (success) console.log(`%c> Succeed`, "color: grey");
else console.log(`%c> Failed`, "color: grey");

console.log("\n");