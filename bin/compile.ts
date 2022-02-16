/**
 * @copyright Copyright (c) 2022 Adam Josefus
 */


import { join } from "https://deno.land/std@0.125.0/path/mod.ts";
import { gray, bold } from "https://deno.land/std@0.125.0/fmt/colors.ts";


const name = (os => {
    switch (os) {
        case 'darwin':
            return 'pkg.macos';

        case 'windows':
            return 'pkg.exe';

        case 'linux':
            return 'pkg.linux';
    }
})(Deno.build.os)
const path = join(Deno.cwd(), name);

const cmd = [
    `deno`,
    `--unstable`,
    `compile`,
    `--output=${name}`,
    `--allow-all`,
    `./main.ts`
];

console.log("\n");
console.log(bold(`Compile to %c${path}`));
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
