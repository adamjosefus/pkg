import { join } from "https://deno.land/std@0.120.0/path/mod.ts";
import { Color, Style } from "../lib/packages/deno-ascii-office/mod.ts";


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
console.log(Style.bold(`Compile to %c${path}`));
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
    console.log(Color.gray(`> Failed`));
}

console.log("\n");
