/**
 * @copyright Copyright (c) 2022 Adam Josefus
 */

/**
 * Run the CLI.
 */
export async function run(...cmd: (string | number)[]) {
    const process = Deno.run({
        cmd: cmd.map(x => x.toString()),
        stdout: "piped",
        stderr: "piped",
    });

    const { success } = await process.status();
    const output = success ? await process.output() : await process.stderrOutput();

    process.close();

    return {
        success,
        output: new TextDecoder().decode(output).trimStart()
    }
}
