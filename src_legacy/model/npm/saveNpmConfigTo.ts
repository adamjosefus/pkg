/**
 * @author Adam Josefus
 */

import { type NpmConfigType } from "./NpmConfigType.ts"
import { computeNpmConfigPath } from "./computeNpmConfigPath.ts"


/**
 * Create or update package.json file.
 */
export async function saveNpmConfigTo(root: string, config: NpmConfigType): Promise<void> {
    const path = computeNpmConfigPath(root)
    const json = JSON.stringify(config, null, 4) + '\n'

    await Deno.writeTextFile(path, json)
}
