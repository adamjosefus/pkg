import { TransformedConfig } from "../types/TransformedConfig.ts";
import { ProgressBar } from "../utils/ProgressBar.ts";
import { cloneRepository } from "../model/cloneRepository.ts";


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

    const result = await Promise.all(jobs);

    console.log(result);
    
}