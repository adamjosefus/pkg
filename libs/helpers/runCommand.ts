/**
 * @copyright Copyright (c) 2022 Adam Josefus
 */


export async function runCommand(...cmd: string[]) {
    const process = Deno.run({
        cmd,
        stdout: "piped",
        stderr: "piped",
    });

    const status = await process.status();

    const output = await (async (ok) => {
        if (ok) return await process.output()
        else return await process.stderrOutput()
    })(status.success);

    process.close();

    const decoder = new TextDecoder();

    return {
        success: status.success,
        message: decoder.decode(output)
    }
}
