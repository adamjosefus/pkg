import { join } from "https://deno.land/std@0.117.0/path/mod.ts";


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
console.log(`Compile to %c${path}`, "font-weight: bold;");
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