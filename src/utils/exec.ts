import { bytesToString } from "./bytesToString.ts";


/**
 * Run the CLI.
 */
export const exec = async (...cmd: (string | number)[]) => {
    const process = Deno.run({
        cmd: cmd.map(s => `${s}`),
        stdout: "piped",
        stderr: "piped",
    })

    const { success } = await process.status()
    const output = success ? await process.output() : await process.stderrOutput()
    process.close();

    return {
        success,
        output: bytesToString(output).trimStart()
    }
}
