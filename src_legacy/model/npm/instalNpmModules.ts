/**
 * @author Adam Josefus
 */

import { existsSync } from "../helpers/existsSync.ts"
import { run } from "../helpers/run.ts"
import { computeNpmConfigPath } from "./computeNpmConfigPath.ts"


/**
 * Install all Node modules in the given directory.
 */
export async function instalNpmModules(root: string) {
    const path = computeNpmConfigPath(root)
    if (!existsSync(path)) return

    // Create task
    const cmd = ['npm', 'install']

    // Execution
    await run(...cmd)
}
