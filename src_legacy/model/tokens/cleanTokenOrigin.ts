/**
 * @author Adam Josefus
 */

/**
 * Clean the token origin.
 * - remove protocol
 * - remove credentials from the token origin
 * - remove ending slash
 * 
 * @param origin The origin of the token
 * @returns 
 */
export function cleanTokenOrigin(origin: string): string {
    const credentials = /^(https?\:\/\/)?(\w*\:?\w*?@)?/g
    const endSlash = /\/$/g

    return origin.trim()
        .replace(credentials, '')
        .replace(endSlash, '')
}
