/**
 * @copyright Copyright (c) 2022 Adam Josefus
 */


import { ConfigType } from "../types/ConfigType.ts";
import { runCommand } from "../helpers/runCommand.ts";
import * as styles from "../helpers/styles.ts";


function createTask(reference: string, tag: string | null, destinationDir: string, separatedGitDir: string): readonly string[] {
    const task: string[] = [];

    task.push('git', 'clone');
    task.push('--depth', '1');

    if (tag) task.push('--branch', tag);

    task.push('--separate-git-dir', separatedGitDir);

    task.push(reference);
    task.push(destinationDir);
    task.push('--single-branch');

    return task;
}


function print(name: string, columnLength: number, success: boolean, message: string) {
    console.log(
        `> ${name.padEnd(columnLength)}`,
        success
            ? styles.success('install OK')
            : styles.error('install FAILED'),
    );

    if (message.trim() !== '') {
        console.log(styles.note(`>> ${message}`));
    }
}


export async function installPackages(config: ConfigType, separateGitRoot: string): Promise<void> {
    // TODO: Change to temp directory
    Deno.mkdirSync(separateGitRoot);

    const length = config.map(x => x.reference).reduce((a, b) => Math.max(a, b.length), 0);

    for (const item of config) {
        const cmd = createTask(item.reference, item.tag, item.destinationDir, item.separatedGitDir);
        const p = await runCommand(...cmd);

        print(item.displayReference, length + 5, p.success, p.message);
    }

    Deno.removeSync(separateGitRoot, { recursive: true });
}
