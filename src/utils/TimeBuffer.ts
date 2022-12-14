export class TimeBuffer<T> {
    readonly #time: number;
    readonly #callback: (items: T[]) => void;
    readonly #events: T[] = [];

    #timerId: number | undefined;

    constructor(timer: number, callback: (events: T[]) => void) {
        this.#time = timer;
        this.#callback = callback;
    }


    push(item: T) {
        this.#events.push(item);

        if (this.#timerId) {
            clearTimeout(this.#timerId);
        }

        this.#timerId = setTimeout(() => {
            this.#timerId = undefined;
            this.#callback([...this.#events]);
            this.#events.splice(0, this.#events.length);
        }, this.#time);
    }
}
