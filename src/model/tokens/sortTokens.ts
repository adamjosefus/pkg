/**
 * @copyright Copyright (c) 2022 Adam Josefus
 */

import { TokenType } from "./TokenType.ts";


export function sortTokens(a: TokenType, b: TokenType): number {
    if (a.origin.length < b.origin.length) return 1;
    if (a.origin.length > b.origin.length) return -1;

    return a.origin.localeCompare(b.origin);
}
