/**
 * @author Adam Josefus
 */

import { makeAbsolute } from "../helpers/makeAbsolute.ts"
import { cleanTokenOrigin } from "./cleanTokenOrigin.ts"
import { type TokenPointerType as PointerType } from "./TokenPointerType.ts"


/**
 * Create array of tokens from a list of token pointers.
 * 
 * @param pointers 
 * @returns 
 */
export function createTokenPointers(root: string, list: Record<string, string>): PointerType[] {
    const pointers: PointerType[] = Object.entries(list)
        .map(([origin, path]) => {
            const file = makeAbsolute(path, root)

            return {
                origin: cleanTokenOrigin(origin),
                file
            }
        })

    return pointers
}
