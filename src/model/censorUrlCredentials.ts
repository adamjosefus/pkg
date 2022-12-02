/**
 * @author Adam Josefus
 */

/**
 * Hides credentials in the URL.
 * 
 * `usr:pass@example.com` → `●●●@example.com`
 */
export function censorUrlCredentials(url: URL | string): string {
    const regex = /^(?<protocol>\w+:\/\/)(?<authentication>[A-z0-9_\.\-]+\:?[A-z0-9_\.\-]*)@/i

    return url.toString().replace(regex, (_match, protocol, _authentication) => {
        return `${protocol}●●●@`
    })
}
