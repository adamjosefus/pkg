import * as style from "./style.ts";


export const list = (list: string[]) => list.map(line => `• ${line}`).join('\n');

export const indent = (text: string, count: number) => text.split('\n').map(line => '  '.repeat(count) + line).join('\n');

export const cliErrorOutputs = (outputs: string[]) => {
    const label = outputs.length > 1 ? 'Errors' : 'Error';

    console.log(style.error(`${label}:`));
    outputs.forEach(s => console.log(indent(s.trim() + '\n', 1)));
}