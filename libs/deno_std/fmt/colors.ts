export * from "https://deno.land/std@0.167.0/fmt/colors.ts"
import * as c from "https://deno.land/std@0.167.0/fmt/colors.ts"


export const rgb8 = (color: number) => (str: string) => c.rgb8(str, color);
export const bgRgb8 = (color: number) => (str: string) => c.bgRgb8(str, color);

export const rgb24 = (color: number) => (str: string) => c.rgb24(str, color);
export const bgRgb24 = (color: number) => (str: string) => c.bgRgb24(str, color);
