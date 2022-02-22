/**
 * @copyright Copyright (c) 2022 Adam Josefus
 */


import { green, red, yellow, gray, bold } from "https://deno.land/std@0.126.0/fmt/colors.ts";


export function success(s: string) {
    return green(bold(s));
}


export function error(s: string) {
    return red(bold(s));
}


export function warning(s: string) {
    return yellow(bold(s));
}


export function note(s: string) {
    return gray(s);
}
