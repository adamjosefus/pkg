import { TransformedConfig } from "../types/TransformedConfig.ts";
import { ProgressBar } from "../utils/ProgressBar.ts";
import { mapArrayToValues } from "../utils/mapArrayToValues.ts";
import * as render from "../utils/render.ts";
import * as style from "../utils/style.ts";
import { cloneRepository } from "../model/cloneRepository.ts";
import { isDependencyAlreadyInstalled, updateLockFile } from "../model/lockFile.ts";
import { pipe } from "../../libs/esm/fp-ts/function.ts";


const renderSummary = (successedCount: number, cachedCount: number, failedCount: number) => {
    const successed = successedCount > 0 ? style.success : style.neutral;
    const failed = failedCount > 0 ? style.error : style.neutral;

    const parts: string[] = [];
    parts.push(successed(`Installed ${successedCount}`));

    if (cachedCount > 0) {
        parts.push(successed(`Cached ${cachedCount}`));
    }

    parts.push(failed(`Failed ${failedCount}`));

    console.log(`\n${parts.join(' / ')}\n`);
}


const installDependecy = async (root: string, lockFile: string, dependecy: TransformedConfig['dependencies'][0]) => {
    const statuses = {
        chached: 'chached',
        succeeded: 'succeeded',
        failed: 'failed',
    } as const;

    if (await isDependencyAlreadyInstalled(lockFile, dependecy)) return {
        dependecy,
        output: undefined,
        status: statuses.chached
    }

    const { success, output } = await cloneRepository(root, {
        reference: dependecy.reference,
        branch: dependecy.tag,
        destination: dependecy.absDestination,
        name: dependecy.name,
    });

    const status = success ? statuses.succeeded : statuses.failed;
    return { dependecy, output, status }
}


export const installCommand = async (root: string, config: TransformedConfig, lockFile: string) => {
    // TODO: Check if the dependencies length is 0
    // TODO: Check if the dependencies are already installed

    render.commandTitle('Installing dependencies');

    const waiter = new ProgressBar(config.dependencies.length);

    const jobs = config.dependencies.map(async dependecy => {
        const job = await installDependecy(root, lockFile, dependecy);
        waiter.updateProgress(1);

        return job;
    });

    await waiter.setTotal(jobs.length).wait();
    const results = await Promise.all(jobs);

    const succeeded = results.filter(result => result.status === 'succeeded');
    const failed = results.filter(result => result.status === 'failed');
    const chached = results.filter(result => result.status === 'chached');

    updateLockFile(lockFile, config, pipe(succeeded, mapArrayToValues('dependecy')));

    // Render
    renderSummary(succeeded.length, chached.length, failed.length);

    if (failed.length > 0) {
        render.botPet(`I couldn't install all the dependencies.`, 'sad');
        render.emptyLine();

        pipe(
            failed,
            mapArrayToValues('output'),
            render.cliErrorOutputs,
        );
    } else {
        render.botPet(`All dependencies are installed.`, 'happy');
    }
}
