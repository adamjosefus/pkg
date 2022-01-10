export function progress(value: number, max: number, length = 32): string {
    const ratio = value / max;

    const barLength = Math.floor(ratio * length);
    const gapLength = length - barLength;

    const bar = Array(barLength + 1).join('█');
    const gap = Array(gapLength + 1).join('▕');
    const percent = (() => {
        const v = ratio * 100;
        const s = v.toFixed(1);

        if (v < 10) return `  ${s} %`;
        else if (v < 100) return ` ${s} %`;
        else return `${s} %`;
    })();

    return `${bar}${gap} ${percent}`;
}