/**
 * @author Adam Josefus
 */

import { type TokenDeclarationsType } from "../tokens/mod.ts"


type DataRepositoryType = {
    destination?: string,
    name?: string,
    tag?: string,
    disabled?: boolean,
}


/**
 * Dictionary of repository declarations.
 * 
 * ```jsonc
 * {
 *    "https://dev.azure.com/org/proj/_git/repo": {
 *        "destination": "./my-packages",
 *        "name": "myRepo",
 *        "tag": "v1.0.0",
 *        "disabled": false
 *    },
 *    "<url>": {
 *        "destination": "<path>", // optional
 *        "name": "<name>", // optional
 *        "tag": "<tag>", // optional
 *        "disabled": "<boolean>" // optional
 *    },
 *    "<url>": {
 *        "name": "<name>", // optional
 *        "tag": "<tag>", // optional
 *    },
 *    "<url>": "<tag>"
 * }
 * ```
 */
type RepositoryDeclarationType = Record<string, DataRepositoryType | DataRepositoryType[] | string>


/**
 * Dictionary of tokens declarations.
 * 
 * ```jsonc
 * {
 *    "dev.azure.com": "myUsername:myPassword",
 *    "github.com": "myToken",
 *    "<origin>": "<secret>",
 *    "<origin>": {
 *       "file": "<path-to-secret>",
 *    }
 * }
 * ```
 */


type ConfigFileOptions = {
    updateNpmConfig: boolean,
    installNpmModules: boolean,
    useGlobalTokens: boolean,
}


export type ConfigFileSchemaType<Version = string> = Partial<{
    /**
     * Version of the configuration file.
     * Should be in format `v1.0.0`, `1.0.0`, `v1.0` or `1`.
     * 
     * `1.0` is equal to `v1.0.0`.
     */
    version: Version,
    /**
     * Destionation of installed packages. Path is relative to the root of the configuration file.
     */
    destination: string,
    /**
     * Declarations of repositories.
     */
    repositories: RepositoryDeclarationType,
    /**
     * Declarations of tokens.
     */
    tokens: TokenDeclarationsType,
    /**
     * List of files to ignore.
     * Paths are relative to the root of the configuration file.
     * 
     * You can use [glob star](https://www.npmjs.com/package/glob) syntax.
     */
    ignore: string[],
    /**
     * Additional options.
     */
    options: Partial<ConfigFileOptions>,
}>
