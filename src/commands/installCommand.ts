import { TransformedConfig } from "../types/TransformedConfig.ts";
import { ProgressBar } from "../utils/ProgressBar.ts";
import { mapArrayToValues } from "../utils/mapArrayToValues.ts";
import * as render from "../utils/render.ts";
import * as style from "../utils/style.ts";
import { cloneRepository } from "../model/cloneRepository.ts";
import { updateLockFile } from "../model/updateLockFile.ts";
import { pipe } from "../../libs/esm/fp-ts/function.ts";


const renderSummary = (successedCount: number, failedCount: number) => {
    const success = successedCount > 0 ? style.success : style.neutral;
    const error = failedCount > 0 ? style.error : style.neutral;

    const message = [
        `\n`,
        success(`Installed ${successedCount}`),
        ` / `,
        error(`Failed ${failedCount}`),
        `\n`,
    ].join('');

    console.log(message);
}


export const installCommand = async (root: string, config: TransformedConfig, lockFile: string) => {
    // TODO: Check if the dependencies length is 0
    // TODO: Check if the dependencies are already installed

    render.commandTitle('Installing dependencies');

    const waiter = new ProgressBar(config.dependencies.length);

    const jobs = config.dependencies.map(async dependecy => {
        const result = await cloneRepository(root, {
            reference: dependecy.reference,
            branch: dependecy.tag,
            destination: dependecy.absDestination,
            name: dependecy.name,
        });

        waiter.updateProgress(1);

        return {
            dependecy,
            ...result,
        }
    });

    await waiter.setTotal(jobs.length).wait();
    const results = await Promise.all(jobs);
    const successed = results.filter(({ success }) => success);
    const failed = results.filter(r => !successed.includes(r));

    updateLockFile(lockFile, config, pipe(successed, mapArrayToValues('dependecy')));

    // Render
    renderSummary(successed.length, failed.length);

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
