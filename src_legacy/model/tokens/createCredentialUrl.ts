/**
 * @author Adam Josefus
 */

import { join } from "../../libs/path.ts"
import { type TokenType } from "./TokenType.ts"


/**
 * Create url with correct token from token list.
 * 
 * @param url 
 * @param tokens 
 * @returns 
 */
export function createCredentialUrl(url: URL | string, tokens: TokenType[]): string {
    const urlObj = new URL(url.toString())

    const path = join(urlObj.hostname, urlObj.pathname)
    const token = tokens.find(({ origin }) => {
        return path.startsWith(origin)
    })

    if (token === undefined) return urlObj.toString()

    const [username, tokenValue] = ((s) => {
        const [a, b] = s.split(':')
        return b ? [a, b] : [null, a]
    })(token.secret)

    if (username !== null) {
        urlObj.username = username
        urlObj.password = tokenValue
    } else {
        urlObj.username = tokenValue
        urlObj.password = ''
    }

    return urlObj.toString()
}