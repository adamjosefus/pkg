import {
    Box,
    progress,
    Table,
    Style,
    Color,
    Formattable,
} from "./mod.ts";


function h(content: string): void {
    console.log(`\n\n${content}:\n`);
}


function p(content: string): void {
    console.log(`${content}`);
}


h("Progress");
p(progress(25, 100));
p(progress(5, 100));
p(progress(100, 100));


h("Tables");
p(Table.classic([
    ['Jméno', 'Jan\nEvangelista'],
    ['Příjmení', 'Purkyně'],
    ['Věk', 81],
]));

p(Table.classic([
    [
        new Formattable('R', (s) => Style.bold(Color.red(s))),
        new Formattable('G', (s) => Style.bold(Color.green(s))),
        new Formattable('B', (s) => Style.bold(Color.blue(s))),
    ],
]));


h("Boxes");
p(Box.classic('Box'));
p(Box.bold('Bold'));
p(Box.dashed('Dashed'));
p(Box.rounded('Rounded'));
p(Box.double('Double'));
p(Box.pretty('Pretty'));
p(Box.classic(new Formattable('Červená', (s) => Color.red(s))));