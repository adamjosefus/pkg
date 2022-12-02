/**
 * @author Adam Josefus
 */

import { cleanTokenOrigin } from "./cleanTokenOrigin.ts"
import { type TokenDeclarationsType } from "./TokenDeclarationsType.ts"
import { type TokenType } from "./TokenType.ts"
import { type TokenPointerType } from "./TokenPointerType.ts"
import { createTokensFormPointers } from "./createTokensFormPointers.ts"
import { sortTokens } from "./sortTokens.ts"


type Options = {
    skipNonExistOrigins: string[]
}


export async function createTokensFormDeclarations(declarations: TokenDeclarationsType, options?: Options): Promise<TokenType[]> {
    const declarationArr = Object.entries(declarations)
        .map(([origin, value]) => {
            if (typeof value === "string") {
                return {
                    origin,
                    value,
                    pointToFile: false
                }
            } else {
                return {
                    origin,
                    value: value.file,
                    pointToFile: true
                }
            }
        })

    const pointers: TokenPointerType[] = declarationArr
        .filter(({ pointToFile }) => pointToFile)
        .map(({ origin, value }) => ({
            origin: cleanTokenOrigin(origin),
            file: value
        }))

    const t1 = declarationArr
        .filter(({ pointToFile }) => !pointToFile)
        .map(({ origin, value }) => ({
            origin: cleanTokenOrigin(origin),
            secret: value
        }))

    const t2 = await createTokensFormPointers(pointers, {
        skipNonExistOrigins: options?.skipNonExistOrigins ?? []
    })

    const tokens = [...t1, ...t2].sort((a, b) => sortTokens(a, b))

    return tokens
}
