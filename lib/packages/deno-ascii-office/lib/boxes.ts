import { Formattable } from "./model/Formattable.ts";


type PartsType = {
    left: string,
    right: string,
    top: string,
    bottom: string,
    corner1: string,
    corner2: string,
    corner3: string,
    corner4: string,
}


export function custom(text: Formattable | string, parts: PartsType): string {
    const regex = {
        lineSpliter: /\n/g
    }

    const result: string[] = [];

    const lines: (Formattable | string)[] = text.split(regex.lineSpliter);
    const length = lines.reduce((v, l) => l.length > v ? l.length : v, 0);

    lines.forEach((s, i, arr) => {
        // First
        if (i == 0) {
            result.push(`${parts.corner1}${Array(length + 1).join(parts.top)}${parts.corner2}`);
        }

        result.push(`${parts.left}${s.toString()}${Array(length - s.length + 1).join(' ')}${parts.right}`);

        // Last
        if (arr.length - 1 == i) {
            result.push(`${parts.corner4}${Array(length + 1).join(parts.bottom)}${parts.corner3}`);
        }
    });

    return result.join('\n');
}


export function classic(text: Formattable | string): string {
    return custom(text, {
        left: '│ ',
        right: ' │',
        top: '─',
        bottom: '─',
        corner1: '┌─',
        corner2: '─┐',
        corner3: '─┘',
        corner4: '└─',
    });
}


export function bold(text: Formattable | string): string {
    return custom(text, {
        left: '┃ ',
        right: ' ┃',
        top: '━',
        bottom: '━',
        corner1: '┏━',
        corner2: '━┓',
        corner3: '━┛',
        corner4: '┗━',
    });
}


export function dashed(text: Formattable | string): string {
    return custom(text, {
        left: '╎ ',
        right: ' ╎',
        top: '╌',
        bottom: '╌',
        corner1: '┌╌',
        corner2: '╌┐',
        corner3: '╌┘',
        corner4: '└╌',
    });
}


export function rounded(text: Formattable | string): string {
    return custom(text, {
        left: '│ ',
        right: ' │',
        top: '─',
        bottom: '─',
        corner1: '╭─',
        corner2: '─╮',
        corner3: '─╯',
        corner4: '╰─',
    });
}


export function double(text: Formattable | string): string {
    return custom(text, {
        left: '║ ',
        right: ' ║',
        top: '═',
        bottom: '═',
        corner1: '╔═',
        corner2: '═╗',
        corner3: '═╝',
        corner4: '╚═',
    });
}


export function pretty(text: Formattable | string): string {
    return custom(text, {
        left: '│ ',
        right: ' ┃',
        top: '─',
        bottom: '━',
        corner1: '┌─',
        corner2: '─┒',
        corner3: '━┛',
        corner4: '┕━',
    });
}