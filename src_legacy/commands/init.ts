/**
 * @author Adam Josefus
 */

import { configName, type ConfigExtensionType } from "../dogma.ts"
import { ExpectedException } from "../libs/allo_arguments.ts"
import { join } from "../libs/path.ts"
import { createConfigFileSchema } from "../model/configs/mod.ts"
import { existsSync } from "../model/helpers/existsSync.ts"
import { block as blck } from "../model/helpers/styles.ts"



async function createConfigFile(root: string, extension: ConfigExtensionType) {
    const schema = createConfigFileSchema()

    const json = JSON.stringify(schema, null, 4) + "\n"
    const filename = `${configName}${extension}`
    const path = join(root, filename)

    // Check if config file already exists
    if (existsSync(path)) {
        throw new ExpectedException(`Config file already exists: ${path}`)
    }
    
    await Deno.writeTextFile(path, json)

    blck.message(`Created config file: ${filename}`)
}


/**
 * Creates a new config file with default values.
 */
export async function init(root: string, extension: ConfigExtensionType) {
    // Intro
    console.log(blck.message(`Creating a new config file...`))
    console.log('') // New line

    // Create config file
    await createConfigFile(root, extension)

    // Outro
    console.log('') // New line
}
