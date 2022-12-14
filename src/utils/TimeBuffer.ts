export class TimeBuffer<T> {
    readonly #time: number;
    readonly #callback: (items: T[]) => void;
    readonly #items: T[] = [];

    #timerId: number | undefined;

    constructor(timer: number, callback: (items: T[]) => void) {
        this.#time = timer;
        this.#callback = callback;
    }


    push(item: T) {
        this.#items.push(item);

        if (this.#timerId) {
            clearTimeout(this.#timerId);
        }

        this.#timerId = setTimeout(() => {
            this.#timerId = undefined;
            this.#callback([...this.#items]);
            this.#items.splice(0, this.#items.length);
        }, this.#time);
    }
}
