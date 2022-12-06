import * as c from "../../libs/deno_std/fmt/colors.ts";
import { pipe } from "../../libs/esm/fp-ts/function.ts";
import { getRandomItem } from "./getRandomItem.ts";
import * as style from "./style.ts";


export const list = (list: string[]) => list.map(line => `• ${line}`).join('\n');


export const indent = (text: string, count: number) => text.split('\n').map(line => '  '.repeat(count) + line).join('\n');


export const emptyLine = () => console.log('\n');


export const cliErrorOutputs = (outputs: string[]) => {
    const label = outputs.length > 1 ? 'Errors' : 'Error';

    console.log(style.error(`${label}:`));
    outputs.forEach(s => console.log(indent(s.trim() + '\n', 1)));
}


export const botPet = (message: string, mood: 'happy' | 'sad' | 'broken') => {
    // const eye = `●`;
    const moodSets = {
        happy: [
            [`●`, `◡`, `●`],
            [`●`, `◡`, `●`],
            [`●`, `◡`, `●`],
            [`●`, `◡`, `━`],
            [`●`, `◡`, `<`],
            [`●`, `◡`, `━`],
        ],
        sad: [
            [`◡`, `_`, `◡`],
            [`◡`, `_`, `◡`],
            [`◡`, `.`, `◡`],
            [`●`, `∙`, `●`],
            [`●`, `_`, `●`],
        ],
        broken: [
            [`X`, `.`, `X`],
            [`X`, `.`, `x`],
            [`x`, `.`, `X`],
            [`x`, `.`, `x`],
            [`✕`, `.`, `✕`],
            [`✕`, `.`, `x`],
            [`✕`, `.`, `X`],
            [`x`, `.`, `✕`],
            [`X`, `.`, `✕`],
        ],
    };

    const [eye1, mouth, eye2] = getRandomItem(moodSets[mood]);

    console.log([
        style.botPet(`╭───────╮`),
        style.botPet(`│ ${eye1} ${mouth} ${eye2} │`) + ` ${style.botMessage(message ?? '')}`,
        style.botPet(`╰───────╯`),
    ].join('\n'));
}


export const commandTitle = (title: string) => {
    const s = ` ${title.trim()} `;

    console.log('');
    console.log(pipe(
        s,
        c.bold,
        c.rgb24(0xb6e3ff),
        c.bgRgb24(0x002255),
    ));
}
