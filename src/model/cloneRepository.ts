import { relative } from "../../libs/deno_std/path/mod.ts";
import { exec } from "../utils/exec.ts";


export const cloneRepository = async (root: string, repo: { reference: string, tag?: string, destination: string }) => {
    // Preparation
    const separatedGitDir = await Deno.makeTempDir();

    // Create clone task
    const cmd = ['git', 'clone', '--depth=1'];

    if (repo.tag) cmd.push(`--branch=${repo.tag}`);

    cmd.push(`--separate-git-dir=${separatedGitDir}/git`);
    cmd.push(repo.reference);
    cmd.push(repo.destination);
    cmd.push('--single-branch');

    // Execution
    const { output, ok } = await exec(...cmd)

    // Cleanup
    await Deno.remove(separatedGitDir, { recursive: true })

    return {
        ok,
        output: ((s) => {
            const real = repo.destination
            const pretty = relative(root, real)

            return s.replaceAll(real, pretty)
        })(output)
    }
}