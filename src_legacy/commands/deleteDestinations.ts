/**
 * @author Adam Josefus
 */

import { relative } from "../libs/path.ts"
import { ConfigType } from "../model/configs/mod.ts"
import { ask } from "../model/helpers/ask.ts"
import { existsSync } from "../model/helpers/existsSync.ts"
import { list, inline as inl } from "../model/helpers/styles.ts"
import { block as blck } from "../model/helpers/styles.ts"


function askForConfirmation(): boolean {
    const question = 'Are you sure you want to delete the directories?'
    const msg = ['', question].join('\n')

    return ask(msg, {
        'n': () => false,
        'y': () => true,
    })
}


export async function deleteDestinations(root: string, config: ConfigType, needConfirmation = true) {
    // Prepare paths
    const paths = [config.destinationDir, ...config.repositories.map(r => r.destination)]
        // Remove duplicates
        .filter((p, i, arr) => arr.indexOf(p) === i)
        // Remove empty paths
        .filter(dir => dir !== null)
        // Hack for TypeScript, `null` values are not allowed in `filter`
        .map(dir => dir!)
        // Remove paths that don't exist
        .filter(dir => existsSync(dir))
        // Sort by alphabetical order
        .sort((a, b) => a.localeCompare(b))
        // Relative to root
        .map(p => relative(root, p))
        // Pretify paths
        .map(p => p.startsWith('.') ? p : `./${p}`)

    if (paths.length === 0) {
        return
    }

    // Print paths
    console.log(blck.header(`Deleting destinations...`))
    console.log('') // New line
    console.log(list(paths.map(p => `${inl.warn(p)}`)))

    // Ask for confirmation
    if (needConfirmation && !askForConfirmation()) {
        return
    }

    // Delete paths
    const promises = paths.map(async path => {
        try {
            await Deno.remove(path, { recursive: true })
        } catch (_err) {
            // Ignore because the directory might not exist
            // Checking if the dir exists is not possible because the process is async
        }
    })

    await Promise.all(promises)

    // Outro
    console.log('') // New line
}
