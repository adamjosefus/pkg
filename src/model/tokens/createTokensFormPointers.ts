/**
 * @copyright Copyright (c) 2022 Adam Josefus
 */

import { ExpectedException } from "../../libs/allo_arguments.ts";
import { block as blc, inline as inl } from "../helpers/styles.ts";
import { existsSync } from "../helpers/existsSync.ts";
import { cleanTokenOrigin } from "./cleanTokenOrigin.ts";
import { sortTokens } from "./sortTokens.ts";
import { type TokenPointerType } from "./TokenPointerType.ts";
import { type TokenType } from "./TokenType.ts";


type Options = {
    skipNonExistOrigins: string[];
}


/**
 * Create array of tokens from a list of token pointers.
 * 
 * @param pointers 
 * @returns 
 */
export async function createTokensFormPointers(pointers: TokenPointerType[], options?: Options): Promise<TokenType[]> {
    const skipNonExistOrigins = options?.skipNonExistOrigins ?? []


    const promises = pointers.map(async ({ origin, file }) => {
        if (!existsSync(file)) {
            if (!skipNonExistOrigins.includes(origin)) {
                throw new ExpectedException(`Token file "${file}" does not exist for "${origin}" origin.`);
            }

            return null;
        }

        const text = await Deno.readTextFile(file);

        return {
            origin: cleanTokenOrigin(origin),
            secret: text.trim()
        };
    });

    const tokens = await Promise.all(promises);
    return tokens
        // Remove nulls
        .filter(v => v !== null)
        // Hack for TypeScript, `null` values are not allowed in `filter`
        .map(v => v!)
        // Sort by special function
        .sort((a, b) => sortTokens(a, b));
}
