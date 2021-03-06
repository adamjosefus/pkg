/**
 * @copyright Copyright (c) 2022 Adam Josefus
 */

import { join, dirname, fromFileUrl, normalize, relative } from 'https://deno.land/std@0.138.0/path/mod.ts';
import { gray, bold } from "https://deno.land/std@0.138.0/fmt/colors.ts";


const __dirname = dirname(fromFileUrl(import.meta.url));
const root = join(__dirname, '..');

const packagerName = 'pkg.ts';
const packagerFile = relative(Deno.cwd(), normalize(join(root, packagerName)));

const packageName = 'pkg';


const cmd = [
    'deno',
    'install',
    '--allow-read',
    '--allow-write',
    '--allow-env',
    '--allow-run',
    '--allow-net',
    '--no-prompt',
    `--name=${packageName}`,
    `${packagerFile}`
];

console.log("\n");
console.log(bold(`Install "${packageName}"`));
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
