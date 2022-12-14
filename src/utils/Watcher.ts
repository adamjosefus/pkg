import { compareArrays } from "./compareArrays.ts";
import { makeRelative } from "./makeRelative.ts";
import { TimeBuffer } from "./TimeBuffer.ts";


export class Watcher extends EventTarget {

    readonly #root: string;
    readonly #interestedPaths: readonly string[];

    readonly #watcher: Deno.FsWatcher;
    readonly #buffer: TimeBuffer<Deno.FsEvent>;

    constructor(root: string, paths: string[]) {
        super();

        this.#root = root;
        this.#interestedPaths = Watcher.#normalizePaths(root, paths);

        this.#watcher = Deno.watchFs(root, {
            recursive: true,
        });

        this.#buffer = new TimeBuffer(10, events => this.#dispatchUpdate(events));

        this.#watch();
    }


    #dispatchUpdate(events: Deno.FsEvent[]) {
        const filtered = this.#filterEvents(events);
        this.dispatchEvent(new UpdateEvent(filtered));
    }


    async #watch() {
        for await (const event of this.#watcher) {
            this.#buffer.push(event);
        }
    }


    #filterEvents(events: readonly Deno.FsEvent[]): readonly Deno.FsEvent[] {
        return events
            .reduceRight((acc, curr, i) => {
                const prev = events[i - 1] as Deno.FsEvent | undefined;

                const skip = prev !== undefined
                    && prev.kind === curr.kind
                    && compareArrays(curr.paths, prev.paths);

                if (!skip) acc.unshift(curr);

                return acc;
            }, [] as Deno.FsEvent[])
            .filter(({ paths }) => paths.some(p => this.#interestedPaths.includes(p)));
    }


    close() {
        this.#watcher.close();
    }


    static #normalizePaths(root: string, paths: string[]): string[] {
        return paths
            .filter(path => {
                const r = makeRelative(root, path);
                return !r.startsWith('..');
            })
            .filter((path, index, arr) => arr.indexOf(path) === index);
    }
}


export class UpdateEvent extends CustomEvent<{
    events: readonly Deno.FsEvent[]
}> {

    constructor(events: readonly Deno.FsEvent[]) {
        super("update", {
            detail: {
                events
            }
        });
    }
}
