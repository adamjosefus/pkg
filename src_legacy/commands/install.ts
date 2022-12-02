/**
 * @author Adam Josefus
 */

import { join, relative } from "../libs/path.ts"
import { run } from "../model/helpers/run.ts"
import { block as blck } from "../model/helpers/styles.ts"
import { censorUrlCredentials } from "../model/helpers/censorUrlCredentials.ts"
import { deleteFilesByGlob } from "../model/helpers/deleteFilesByGlob.ts"
import { type ConfigType, RepositoryType, configPathExist, loadConfigFrom } from "../model/configs/mod.ts"
import { instalNpmModules, loadNpmConfigFrom, saveNpmConfigTo, createUpdatedNpmConfig } from "../model/npm/mod.ts"
import { createCredentialUrl, TokenType } from "../model/tokens/mod.ts"


/**
 * Clone a repository
 */
async function cloneRepository(root: string, reference: string, tag: string | null, destination: string) {
    // Preparation
    const separatedGitDir = await Deno.makeTempDir()

    // Create clone task
    const cmd = ['git', 'clone', '--depth=1']

    if (tag) cmd.push(`--branch=${tag}`)

    cmd.push(`--separate-git-dir=${separatedGitDir}/git`)
    cmd.push(reference)
    cmd.push(destination)
    cmd.push('--single-branch')

    // Execution
    const { output, success } = await run(...cmd)

    // Cleanup
    await Deno.remove(separatedGitDir, { recursive: true })

    return {
        success,
        output: ((s) => {
            const real = destination
            const pretty = relative(root, real)

            return s.replaceAll(real, pretty)
        })(output)
    }
}


/**
 * Delete ignored files by config file.
 * 
 * @param root The root directory of the package.
 * @param config The config of the package.
 * @returns 
 */
async function deleteIgnoredFiles(root: string, paths: string[]) {
    if (paths.length === 0) return

    const globs = paths
        // Clean up
        .map(glob => glob.trim())
        // Resolve absolute paths
        .map(glob => join('./', glob))
        // Remove duplicates
        .filter((glob, i, arr) => arr.indexOf(glob) === i)

    const promises = globs.map(glob => deleteFilesByGlob(root, glob))
    await Promise.all(promises)
}


/**
 * Install Package (repository)
 */
async function installPackage(root: string, repo: RepositoryType, tokens: TokenType[], updateNpmConfig: boolean, ignore: string[], checkConfigVersion: boolean) {
    const reference = createCredentialUrl(repo.reference, tokens)
    const displayReference = censorUrlCredentials(reference)

    const localRoot = repo.destination

    // Clone repository
    const { success, output } = await cloneRepository(root, reference, repo.tag, repo.destination)

    if (!success) {
        console.log(blck.process(displayReference, "Failed", "error"))
        console.log(blck.note(output))
    } else {
        console.log(blck.process(displayReference, "Installed", "success"))
    }


    // Update package.json
    if (success && updateNpmConfig) {
        const [currentNpmConfig, packageNpmConfig] = await Promise.all([
            loadNpmConfigFrom(root),
            loadNpmConfigFrom(localRoot)
        ])

        const npmConfig = createUpdatedNpmConfig(currentNpmConfig, packageNpmConfig)
        if (npmConfig) {
            saveNpmConfigTo(root, npmConfig)
        }
    }

    // Install child dependencies (our packages)
    if (success && configPathExist(localRoot)) {
        const localConfig = await loadConfigFrom(localRoot, tokens, {
            checkVersion: checkConfigVersion,
            useGlobalTokens: false
        })

        await installPackages(root, localConfig.repositories, tokens, updateNpmConfig, false, localConfig.ignore, checkConfigVersion)
    }

    // Delete ingored files
    if (success) {
        await deleteIgnoredFiles(localRoot, ignore)
    }
}


async function installPackages(root: string, repositories: Readonly<RepositoryType>[], tokens: TokenType[], updateNpmConfig: boolean, installNpmModules: boolean, ignore: string[], checkConfigVersion: boolean) {
    // ℹ️ This process is must be run sequentially, because of the way npm install works
    for (const repo of repositories) {
        await installPackage(root, repo, tokens, updateNpmConfig, ignore, checkConfigVersion)
    }

    // Install node modules
    if (installNpmModules) {
        await instalNpmModules(root)
    }
}


type Options = {
    checkConfigVersion?: boolean
    forceUpdateNpmConfig: boolean | null,
    forceInstallNpmModules: boolean | null,
}


/**
 * Install all packages from the config file
 */
export async function install(root: string, config: ConfigType, tokens: TokenType[], options: Options) {
    // Intro
    console.log(blck.header("Installing packages..."))
    console.log('') // New line

    // Install packages
    const updateNpmConfig = options.forceUpdateNpmConfig ?? config.options.updateNpmConfig
    const installNpmModules = options.forceInstallNpmModules ?? config.options.installNpmModules
    const ignore = config.ignore
    const checkConfigVersion = options.checkConfigVersion ?? true

    await installPackages(root, config.repositories, tokens, updateNpmConfig, installNpmModules, ignore, checkConfigVersion)

    // Outro
    console.log('') // New line
}
