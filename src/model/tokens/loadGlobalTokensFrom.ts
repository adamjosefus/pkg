/**
 * @copyright Copyright (c) 2022 Adam Josefus
 */

import { globalTokensPath } from "../../globalTokensPath.ts";
import { ExpectedException } from "../../libs/allo_arguments.ts";
import { JSONC } from "../../libs/jsonc.ts";
import { existsSync } from "../helpers/existsSync.ts";
import { cleanTokenOrigin } from "./cleanTokenOrigin.ts";
import { sortTokens } from "./sortTokens.ts";
import { TokenType } from "./TokenType.ts";


export async function loadGlobalTokensFrom(root: string): Promise<TokenType[]> {
    const path = globalTokensPath(root);
    if (!existsSync(path)) return [];

    try {
        const json = await Deno.readTextFile(path);
        const data = JSONC.parse(json) as Record<string, string>;

        return Object.entries(data)
            // Create array item
            .map(([origin, secret]) => {
                return { origin, secret };
            })
            // Clean origin
            .map(({ origin, ...rest }) => {
                return {
                    ...rest,
                    origin: cleanTokenOrigin(origin),
                };
            })
            .sort((a, b) => sortTokens(a, b));

    } catch (_err) {
        throw new ExpectedException(`The "${path}" file is not a valid JSON/JSONC file.`);
    }
}
