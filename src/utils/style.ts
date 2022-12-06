import * as c from "../../libs/deno_std/fmt/colors.ts";
import { flow } from "../../libs/esm/fp-ts/function.ts";

export const syntaxError = flow(c.brightRed, c.underline);
export const error = flow(c.red, c.bold);
export const success = flow(c.brightGreen, c.bold);
export const neutral = flow(c.gray);
export const botPet = flow(c.rgb8(0xffffff));
export const botMessage = flow(c.rgb8(0xffffff), c.italic);


export const progressFull = flow(c.brightGreen, c.bold);
export const progressBlank = flow(c.gray);
