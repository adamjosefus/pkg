import * as c from "../../libs/deno_std/fmt/colors.ts";
import { flow } from "../../libs/esm/fp-ts/function.ts";


export const error = flow(c.brightRed, c.underline);

export const progressFull = flow(c.brightGreen, c.bold);
export const progressBlank = flow(c.gray);
