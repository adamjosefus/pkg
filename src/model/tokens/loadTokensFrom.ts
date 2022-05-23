/**
 * @copyright Copyright (c) 2022 Adam Josefus
 */

import { JSONC } from "../../libs/jsonc.ts";
import { ExpectedException } from "../../libs/allo_arguments.ts";
import { existsSync } from "../helpers/existsSync.ts";
import { type TokenType } from "./TokenType.ts";


/**
 * Load tokens from a JSON/JSOC file.
 * @param file 
 * @returns If the file not exists, return `null`.
 */
export function loadTokensFrom(file: string): TokenType[] | null {
    if (!existsSync(file)) return null;
    const content = Deno.readTextFileSync(file);

    try {
        return JSONC.parse(content) as TokenType[];
    } catch (_error) {
        throw new ExpectedException(`Failed to parse file "${file}"`);
    }
}
