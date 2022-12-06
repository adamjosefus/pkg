import { join, relative } from "../../libs/deno_std/path/mod.ts";
import { exec } from "../utils/exec.ts";


type Options = {
    reference: string,
    destination: string,
    name: string,
    branch?: string,
}


export const cloneRepository = async (root: string, repo: Options) => {
    // Preparation
    const separatedGitDir = await Deno.makeTempDir();

    // Create clone task
    const cmd = ['git', 'clone', '--depth=1'];
    const dir = join(repo.destination, repo.name);

    if (repo.branch) cmd.push(`--branch=${repo.branch}`);

    cmd.push(`--separate-git-dir=${separatedGitDir}/git`);
    cmd.push(repo.reference);
    cmd.push(dir);
    cmd.push('--single-branch');

    // Execution
    const { output, success } = await exec(...cmd)

    // Cleanup
    await Deno.remove(separatedGitDir, { recursive: true })

    return {
        success,
        output: ((s) => {
            const real = repo.destination
            const pretty = relative(root, real)

            return s.replaceAll(real, pretty)
        })(output)
    }
}