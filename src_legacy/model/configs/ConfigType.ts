/**
 * @author Adam Josefus
 */

import { type TokenType } from "../tokens/TokenType.ts"
import { RepositoryType } from "./RepositoryType.ts"
import { currentVersion } from "../../dogma.ts"


export type Options = {
    updateNpmConfig: boolean,
    installNpmModules: boolean,
    useGlobalTokens: boolean,
}


/**
 * Type of configuration object. Not the same as the `ConfigFileSchemaType` type.
 */
export type ConfigType<Version = typeof currentVersion> = {
    version: Version,
    destinationDir: string | null,
    repositories: Readonly<RepositoryType>[],
    tokens: TokenType[],
    ignore: string[],
    options: Options,
}
