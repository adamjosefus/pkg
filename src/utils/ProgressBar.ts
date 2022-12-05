import { pipe } from "../../libs/esm/fp-ts/function.ts";
import * as style from "./style.ts";


const createRender = (total: number) => {
    const textSize = 1 + 3 + 1 + 1; // space, 3 digits, space, symbol
    const columnSize = Math.min(40, Deno.consoleSize().columns) - textSize;
    const clearLine = "\x1b[2K\r";

    return (current: number) => {
        const blankSymbol = "╶";
        const fullSymbol = "━";

        const ratio = Math.min(current, total) / total;
        const barSize = Math.floor(ratio * columnSize);

        const bar = [
            style.progressFull(fullSymbol.repeat(barSize)),
            style.progressBlank(blankSymbol.repeat(columnSize - barSize)),
        ].join('');

        const percentage = pipe(
            ratio === 1 ? style.progressFull : style.progressBlank,
            style => style(`${Math.floor(ratio * 100)} %`.padStart(textSize, ' '))
        );

        const lastBreakLine = ratio === 1 ? '\n' : '';

        Deno.stdout.writeSync(new TextEncoder().encode([
            clearLine,
            bar,
            percentage,
            lastBreakLine,
        ].join('')));
    }
}


export class ProgressBar {

    #waiting = false;
    #eventTarget = new EventTarget();
    #progress = 0;
    #total = 0;

    #onChange: () => void;


    constructor(total: number) {
        const render = createRender(total);
        
        this.#onChange = () => {
            if (!this.#waiting) return;

            const total = Math.max(this.getTotal(), 0);
            const progress = Math.max(Math.min(this.getProgress(), total), 0);

            render(progress);

            if (progress >= total) this.stop();
        }

        this.setTotal(total);
    }


    getTotal() {
        return this.#total;
    }


    setTotal(total: number) {
        this.#total = total;
        this.#fireChange();
    }


    getProgress() {
        return this.#progress;
    }


    setProgress(iterator: number) {
        this.#progress = iterator;
        this.#fireChange();
    }


    updateProgress(update: number) {
        this.setProgress(this.#progress + update);
    }


    wait(): Promise<void> {
        this.#waiting = true;

        return new Promise(resolve => {
            this.#eventTarget.addEventListener('update', this.#onChange.bind(this));
            this.#eventTarget.addEventListener('stop', () => resolve(), { once: true });
            this.#fireChange();
        });
    }


    stop() {
        this.#waiting = false;

        this.#eventTarget.removeEventListener('update', this.#onChange.bind(this));
        this.#eventTarget.dispatchEvent(new CustomEvent('stop'));
    }

    #fireChange() {
        this.#eventTarget.dispatchEvent(new CustomEvent('update'));
    }
}
