import { black, blue, cyan, gray, green, magenta, red, white, yellow, brightBlack, brightBlue, brightCyan, brightGreen, brightMagenta, brightRed, brightWhite, brightYellow, } from "https://deno.land/std@0.120.0/fmt/colors.ts";
import { bold, italic } from "https://deno.land/std@0.120.0/fmt/colors.ts";


export const Color = {
    black,
    blue,
    cyan,
    gray,
    green,
    magenta,
    red,
    white,
    yellow,
    brightBlack,
    brightBlue,
    brightCyan,
    brightGreen,
    brightMagenta,
    brightRed,
    brightWhite,
    brightYellow,
}


export const Style = {
    bold,
    italic,
}

export * as Box from "./lib/boxes.ts";

export * as Table from "./lib/tables.ts";

export { progress } from "./lib/progress.ts";

export { Formattable } from "./lib/model/Formattable.ts";