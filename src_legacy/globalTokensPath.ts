/**
 * @author Adam Josefus
 */

/**
 * Return the path to the global tokens file.
 * 
 * Path depends on the following environment variables:
 * - `DENO_DIR`
 * - `HOME`
 * 
 * @returns 
 */
export function globalTokensPath(root: string): string {
    function getEnv(env: string, sufix?: string): string | null {
        const v = Deno.env.get(env)
        return v ? `${v}${sufix ?? ''}` : null
    }

    const dir = null
        ?? getEnv('DENO_DIR')
        ?? getEnv('HOME', '/.deno')
        ?? root

    return `${dir}/packager_global_tokens.json`
}
