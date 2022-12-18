import { LockFile } from "../types/LockFile.ts";
import { TransformedConfig } from "../types/TransformedConfig.ts";
import { exists } from "../utils/exists.ts";
import { prettyJson } from "../utils/prettyJson.ts";


type LockDependency = LockFile['dependencies'][number];
type LockVersion = LockFile['version'];


const compareDependencies = (a: LockDependency, b: LockDependency): number => {
    const reference = a.reference.localeCompare(b.reference);
    if (reference !== 0) return reference;

    if (a.tag === null && b.tag === null) return 0;
    if (a.tag === null) return -1;
    if (b.tag === null) return 1;

    const tag = a.tag.localeCompare(b.tag);
    if (tag !== 0) return tag;

    return a.name.localeCompare(b.name);
}


const areDependenciesSame = (a: LockDependency, b: LockDependency) => compareDependencies(a, b) === 0;


const compareVersions = (a: LockVersion, b: LockVersion): number => {
    if (a.major !== b.major) return a.major - b.major;
    if (a.minor !== b.minor) return a.minor - b.minor;
    if (a.patch !== b.patch) return a.patch - b.patch;

    if (a.flag === undefined && b.flag === undefined) return 0;
    if (a.flag === undefined) return -1;
    if (b.flag === undefined) return 1;

    return a.flag.localeCompare(b.flag);
}

const areVersionsSame = (a: LockVersion, b: LockVersion) => compareVersions(a, b) === 0;


const areLocksSame = (a: LockFile, b: LockFile) => {
    if (!areVersionsSame(a.version, b.version)) return false;
    if (a.dependencies.length !== b.dependencies.length) return false;

    for (let i = 0; i < a.dependencies.length; i++) {
        if (!areDependenciesSame(a.dependencies[i], b.dependencies[i])) return false;
    }

    return true;
}



export const createDependencies = (fromConfig: TransformedConfig['dependencies'], fromLock: LockFile['dependencies'], installed: TransformedConfig['dependencies']): LockFile['dependencies'] => {
    return fromLock
        .filter(x => !fromConfig.some(y => areDependenciesSame(x, y))) // Filter out dependencies that are not in the config anymore
        .filter(x => !installed.some(y => areDependenciesSame(x, y))) // Filter out dependencies that are freshly installed
        .concat(installed) // Append freshly installed dependencies
        .map(({ reference, tag, name }) => ({ reference, tag, name })) // Make sure that the dependencies are not mutated. This is important for the lock file to be deterministic
        .sort((a, b) => { // Sort dependencies by reference, name and tag, so that the lock file is deterministic
            if (a.reference !== b.reference) return a.reference.localeCompare(b.reference);
            if (a.name !== b.name) return a.name.localeCompare(b.name);
            if (a.tag !== b.tag) return (a.tag ?? '').localeCompare(b.tag ?? '');

            return 0;
        });
}


const loadLockFile = async (file: string): Promise<LockFile | undefined> => {
    try {
        const content = await Deno.readTextFile(file);

        try {
            return JSON.parse(content);
        } catch (_err) {
            return undefined;
        }
    } catch (err) {
        if (err instanceof Deno.errors.NotFound) {
            return undefined;
        }

        throw err;
    }
}


export const isAlreadyInstalled = async (file: string, dependency: LockDependency): Promise<boolean> => {
    const locked = await loadLockFile(file);

    return (locked?.dependencies ?? []).some(d => areDependenciesSame(d, dependency));
}


export const updateLockFile = async (file: string, config: TransformedConfig, justInstalled: TransformedConfig['dependencies']) => {
    const current = await loadLockFile(file);
    const dependencies = createDependencies(config.dependencies, current?.dependencies ?? [], justInstalled);

    const updated: LockFile = {
        version: config.version,
        dependencies,
    };


    const shouldUpdate = current === undefined || (() => {
        try {
            return !areLocksSame(current, updated);
        } catch (_err) {
            return true;
        }
    })();

    if (shouldUpdate) {
        await Deno.writeTextFile(file, prettyJson(updated), {
            create: true,
            append: false,
        });
    }
}
