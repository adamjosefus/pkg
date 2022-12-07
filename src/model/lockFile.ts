import { LockFile } from "../types/LockFile.ts";
import { TransformedConfig } from "../types/TransformedConfig.ts";
import { exists } from "../utils/exists.ts";
import { prettyJson } from "../utils/prettyJson.ts";


interface Dependency {
    reference: string,
    tag: string | null,
    name: string,
}

const createBlankLockValue = () => ({}) as const;


const isDependencySame = (a: Dependency, b: Dependency) => {
    if (a.reference !== b.reference) return false;
    if (a.tag !== b.tag) return false;
    if (a.name !== b.name) return false;

    return true;
}


export const createDependencies = (configDependencies: TransformedConfig['dependencies'], lockedDependencies: LockFile['dependencies'], installedDependencies: TransformedConfig['dependencies']): LockFile['dependencies'] => {
    return lockedDependencies
        // Filter out dependencies that are not in the config anymore
        .filter(x => !configDependencies.some(y => isDependencySame(x, y)))
        // Filter out dependencies that are freshly installed
        .filter(x => !installedDependencies.some(y => isDependencySame(x, y)))
        // Append freshly installed dependencies
        .concat(installedDependencies)
        // Sort dependencies by reference, name and tag, so that the lock file is deterministic
        .sort((a, b) => {
            if (a.reference !== b.reference) return a.reference.localeCompare(b.reference);
            if (a.name !== b.name) return a.name.localeCompare(b.name);
            if (a.tag === null) return -1;
            if (b.tag === null) return 1;
            if (a.tag !== b.tag) return a.tag.localeCompare(b.tag);

            return 0;
        });
}


const loadLockFile = async (file: string): Promise<Partial<LockFile>> => {
    try {
        const content = await Deno.readTextFile(file);

        try {
            return JSON.parse(content);
        } catch (_err) {
            return createBlankLockValue();
        }
    } catch (err) {
        if (err instanceof Deno.errors.NotFound) {
            return createBlankLockValue();
        }

        throw err;
    }
}


export const ensureLockFile = async (file: string) => {
    if (await exists(file)) return;

    const content = prettyJson(createBlankLockValue());

    console.log({content});
    

    await Deno.writeTextFile(file, content, {
        create: true,
        append: false,
    });
}


export const isDependencyAlreadyInstalled = async (file: string, dependency: Dependency): Promise<boolean> => {
    const current = await loadLockFile(file);

    return (current?.dependencies ?? []).some(x => isDependencySame(x, dependency));
}


export const updateLockFile = async (file: string, config: TransformedConfig, justInstalled: TransformedConfig['dependencies']) => {
    const current = await loadLockFile(file);
    const dependencies = createDependencies(config.dependencies, current?.dependencies ?? [], justInstalled);

    const updated = createBlankLockValue();

    const updatedContent = prettyJson(updated);
    const currentContent = prettyJson(current);

    const shouldUpdate = updatedContent !== currentContent;

    if (shouldUpdate) {
        await Deno.writeTextFile(file, prettyJson(updated), {
            create: true,
            append: false,
        });
    }
}