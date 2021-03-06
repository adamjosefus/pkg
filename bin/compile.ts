/**
 * @copyright Copyright (c) 2022 Adam Josefus
 */


import { join, dirname, fromFileUrl, normalize, relative } from 'https://deno.land/std@0.138.0/path/mod.ts';
import { gray, bold } from "https://deno.land/std@0.138.0/fmt/colors.ts";


const __dirname = dirname(fromFileUrl(import.meta.url));
const root = join(__dirname, '..');

const packagerName = 'pkg.ts';
const outputName = (os => {
    switch (os) {
        case 'darwin': return 'pkg.macos';
        case 'windows': return 'pkg.exe';
        case 'linux': return 'pkg.linux';
    }
})(Deno.build.os)

const packagerFile = relative(Deno.cwd(), normalize(join(root, packagerName)));
const outputFile = relative(Deno.cwd(), normalize(join(root, outputName)));


const cmd = [
    `deno`,
    `compile`,
    '--allow-read',
    '--allow-write',
    '--allow-env',
    '--allow-run',
    '--allow-net',
    '--no-prompt',
    `--output=${outputFile}`,
    `${packagerFile}`
];

console.log("\n");
console.log(bold(`Compile to ${outputName}`));
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
    console.log(gray(`> Failed`));
}

console.log("\n");
