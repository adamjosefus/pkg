import { TransformedConfig } from "../types/TransformedConfig.ts";
import { ProgressBar } from "../utils/ProgressBar.ts";
import * as render from "../utils/render.ts";
import * as style from "../utils/style.ts";
import { cloneRepository } from "../model/cloneRepository.ts";


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


export const installCommand = async (root: string, config: TransformedConfig) => {
    // TODO: Check if the dependencies length is 0
    // TODO: Check if the dependencies are already installed

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

    // Render
    const successed = results.filter(({ success }) => success);
    const failed = results.filter(r => !successed.includes(r));

    renderSummary(successed.length, failed.length);

    if (failed.length > 0) {
        render.botPet(`I couldn't install all the dependencies.`, 'sad');
        console.log('');
        
        render.cliErrorOutputs(failed.map(({ output }) => output));
    } else {
        render.botPet(`All dependencies are installed.`, 'happy');
    }
}
