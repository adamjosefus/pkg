/**
 * @copyright Copyright (c) 2022 Adam Josefus
 */


import { join } from "https://deno.land/std@0.125.0/path/mod.ts";
import { gray, bold } from "https://deno.land/std@0.125.0/fmt/colors.ts";


const name = 'pkg.bundled.js';
const path = join(Deno.cwd(), name);

const cmd = [
    `deno`,
    `bundle`,
    `./pkg.ts`,
    `./${name}`
];

console.log("\n");
console.log(bold(`Bundle to ${path}`));
console.log(gray(`> ${cmd.join(' ')}`));

const process = await Deno.run({
    cmd: cmd,
    stdout: 'piped',
    stderr: 'piped',
})

const { success } = await process.status();

if (success) {
    console.log(gray(`> Succeed`));
} else {
    const outputBytes = await process.stderrOutput()
    const output = (new TextDecoder()).decode(outputBytes);
    console.log(gray(`> Failed`));
    console.log(gray(`>> ${output}`));
}

console.log("\n");
