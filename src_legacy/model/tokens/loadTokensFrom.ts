/**
 * @author Adam Josefus
 */

import { JSONC } from "../../../libs/esm/jsonc-parser/mod.ts";
import { ExpectedException } from "../../../libs/deno_x/allo_arguments.ts";
import { existsSync } from "../helpers/existsSync.ts"
import { type TokenType } from "./TokenType.ts"
import { sortTokens } from "./sortTokens.ts"


/**
 * Load tokens from a JSON/JSOC file.
 * @param file 
 * @returns If the file not exists, return `null`.
 */
export function loadTokensFrom(file: string): TokenType[] | null {
    if (!existsSync(file)) return null
    const content = Deno.readTextFileSync(file)

    try {
        const tokens = JSONC.parse(content) as TokenType[]
        return tokens.sort((a, b) => sortTokens(a, b))

    } catch (_error) {
        throw new ExpectedException(`Failed to parse file "${file}"`)
    }
}
