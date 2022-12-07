import { filterExistPathSync } from "./filterExistPath.ts";

export class Watcher extends EventTarget {

    readonly #watcher: Deno.FsWatcher;
    readonly #paths: readonly string[];

    constructor(path: string | (string | null | undefined)[]) {
        super();

        this.#paths = Watcher.#normalizePaths(path);
        this.#watcher = Deno.watchFs(filterExistPathSync(this.#paths), {
            recursive: true,
        });

        this.#watch();
    }


    async #watch() {
        for await (const { kind, paths, flag } of this.#watcher) {
            this.dispatchEvent(new WatcherEvent(kind, paths, flag));
        }
    }


    close() {
        this.#watcher.close();
    }


    static #normalizePaths(paths: (string | null | undefined)[] | string) {
        return [paths].flat().filter(s => typeof s === 'string') as string[]
    }
}


export class WatcherEvent extends Event {

    readonly paths: readonly string[];
    readonly flag: string | undefined;


    constructor(type: 'any' | 'access' | 'create' | 'modify' | 'remove' | 'other', paths: string[], flag?: Deno.FsEventFlag) {
        super(type);

        this.paths = paths;
        this.flag = flag;
    }
}
