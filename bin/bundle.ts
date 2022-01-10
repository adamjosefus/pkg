import { join } from "https://deno.land/std@0.120.0/path/mod.ts";
import { Color, Style } from "../lib/packages/deno-ascii-office/mod.ts";


const name = 'pkg.bundled.js';
const path = join(Deno.cwd(), name);

const cmd = [
    `deno`,
    `--unstable`,
    `bundle`,
    `./main.ts`,
    `./${name}`
];

console.log("\n");
console.log(Style.bold(`Bundle to %c${path}`));
console.log(Color.gray(`> ${cmd.join(' ')}`));

const process = await Deno.run({
    cmd: cmd,
    stdout: 'piped',
    stderr: 'piped',
})

const { success } = await process.status();

if (success) {
    console.log(Color.gray(`> Succeed`));
} else {
    const outputBytes = await process.stderrOutput()
    const output = (new TextDecoder()).decode(outputBytes);
    console.log(Color.gray(`> Failed`));
    console.log(Color.gray(`>> ${output}`));
}

console.log("\n");
