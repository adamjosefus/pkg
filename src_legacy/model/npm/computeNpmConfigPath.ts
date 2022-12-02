/**
 * @author Adam Josefus
 */

import { join } from "../../libs/path.ts"


/**
 * Get possible npm config path
 */
export function computeNpmConfigPath(root: string): string {
    return join(root, 'package.json')
}
