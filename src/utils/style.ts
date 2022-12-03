import * as c from "../../libs/deno_std/fmt/colors.ts";
import { flow } from "../../libs/esm/fp-ts/function.ts";


export const error = flow(c.brightRed, c.underline);
