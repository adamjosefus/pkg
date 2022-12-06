import * as c from "../../libs/deno_std/fmt/colors.ts";
import { flow } from "../../libs/esm/fp-ts/function.ts";


const rgb8 = (color: number) => (str: string) => c.rgb8(str, color);


export const syntaxError = flow(c.brightRed, c.underline);
export const error = flow(c.red, c.bold);
export const success = flow(c.brightGreen, c.bold);
export const neutral = flow(c.gray);
export const botPet = flow(rgb8(0xffffff));
export const botMessage = flow(rgb8(0xffffff), c.italic);


export const progressFull = flow(c.brightGreen, c.bold);
export const progressBlank = flow(c.gray);
