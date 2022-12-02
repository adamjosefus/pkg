import { filterExistPathSync } from "./filterExistPath.ts";

export class Watcher extends EventTarget {

    #watcher: Deno.FsWatcher;

    constructor(path: string | (string | null | undefined)[]) {
        super();

        const paths = [path].flat().filter(s => typeof s === 'string') as string[];

        this.#watcher = Deno.watchFs(filterExistPathSync(paths), {
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
