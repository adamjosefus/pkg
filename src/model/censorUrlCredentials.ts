/**
 * @author Adam Josefus
 */


const parser = /^(?<protocol>\w+:\/\/)(?<authentication>[A-z0-9_\.\-]+\:?[A-z0-9_\.\-]*)@/i


/**
 * Hides credentials in the URL.
 * 
 * `usr:pass@example.com` → `●●●@example.com`
 */
export const censorUrlCredentials = (url: URL | string): string => {
    parser.lastIndex = 0
    return url.toString().replace(parser, (_match, protocol, _authentication) => `${protocol}●●●@`)
}
