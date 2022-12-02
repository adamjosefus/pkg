import { cleanTokenOrigin } from "./cleanTokenOrigin.ts"
import { sortTokens } from "./sortTokens.ts"
import { type TokenType } from "./TokenType.ts"


export function parseTokenCliArgument(value: string | null): TokenType[] {
    if (!value) return []

    return value.split(',').map(s => {
        const [secret, origin] = s.split('@')

        return {
            origin: cleanTokenOrigin(origin),
            secret: secret.trim()
        }
    }).sort((a, b) => sortTokens(a, b))
}
