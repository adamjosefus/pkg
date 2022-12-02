/**
 * @author Adam Josefus
 */

import { NpmConfigType } from "./NpmConfigType.ts"


/**
 * Parse a NPM format version string.
 */
function parseVersion(version: string) {
    const regex = /(?<major>[0-9]+)(\.(?<minor>[0-9]+)(\.(?<patch>[0-9]+))?)?(-(?<label>[A-z0-9._-]+))?/

    const match = regex.exec(version)
    const { major, minor, patch, label } = match?.groups ?? {}

    return {
        parts: [
            major ?? 0,
            minor ?? 0,
            patch ?? 0,
        ],
        label: label ?? null,
    }
}


/**
 * Returns `true` if the current version is greater than the supplement version.
 */
function needUpdate(currentVersion: string, supplementVersion: string): boolean {
    const current = parseVersion(currentVersion)
    const supplement = parseVersion(supplementVersion)

    const length = Math.max(current.parts.length, supplement.parts.length)
    for (let i = 0; i < length; i++) {
        const c = current.parts.at(i) ?? 0
        const s = supplement.parts.at(i) ?? 0

        if (s > c) return true
    }

    // `^1.0.0-beta.1` is smaller than `1.0.0`
    if (current.label !== null && supplement.label == null) return true

    return false
}


/**
 * Create NPM config with updated dependencies.
 * Returns `null` if no update is needed.
 * 
 * @param base NPM config
 * @param supplement NPM config with updated dependencies
 */
export function createUpdatedNpmConfig(base: NpmConfigType | null, supplement: NpmConfigType | null): NpmConfigType | null {
    if (supplement === null) return null

    let updated = 0

    const dependencies = new Map(Object.entries(base?.dependencies ?? {}))
    const supplementDependencies = Object.entries(supplement.dependencies ?? {})
    supplementDependencies.forEach(([name, version]) => {
        // Skip if the dependency is already in the base config
        if (dependencies.has(name) && !needUpdate(dependencies.get(name)!, version)) return
        dependencies.set(name, version)
        updated++
    })

    const devDependencies = new Map(Object.entries(base?.devDependencies ?? {}))
    const supplementDevDependencies = Object.entries(supplement.devDependencies ?? {})

    supplementDevDependencies.forEach(([name, version]) => {
        function isTypes(packageName: string): boolean {
            const prefixes = ['@types/']
            const names = ['bun-types']

            if (prefixes.some(prefix => packageName.startsWith(prefix)))  return true
            if (names.includes(packageName)) return true

            return false
        }

        // Skip if the dependency is already in the base config
        if (dependencies.has(name) && !needUpdate(devDependencies.get(name)!, version)) return
        if (devDependencies.has(name) && !needUpdate(devDependencies.get(name)!, version)) return

        // Skip if the dependency is not from `DefinitlyTyped`
        if (!isTypes(name)) return

        devDependencies.set(name, version)
        updated++
    })

    const npmConfig: NpmConfigType = {
        ...base,
        dependencies: Object.fromEntries(dependencies),
        devDependencies: Object.fromEntries(devDependencies),
    }

    return updated > 0 ? npmConfig : null
}
