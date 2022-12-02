/**
 * @author Adam Josefus
 */

import { dirname } from "../../libs/path.ts"
import { ensureDir } from "../../libs/fs.ts"
import { globalTokensPath } from "../../globalTokensPath.ts"
import { sortTokens } from "./sortTokens.ts"
import { TokenType } from "./TokenType.ts"


export async function saveGlobalTokensTo(root: string, tokens: TokenType[]): Promise<void> {
    const path = globalTokensPath(root)

    const entries = tokens
        // Sort store by more specificness
        .sort((a, b) => sortTokens(a, b))
        // Create entry
        .map(({ origin, secret }) => {
            return [
                origin,
                secret,
            ]
        })

    // Save store to file
    const json = JSON.stringify(Object.fromEntries(entries), null, 4) + '\n'

    await ensureDir(dirname(path))
    await Deno.writeTextFile(path, json)
}
