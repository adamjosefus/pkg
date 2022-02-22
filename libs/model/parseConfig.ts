/**
 * @copyright Copyright (c) 2022 Adam Josefus
 */


import { join, basename } from "https://deno.land/std@0.126.0/path/mod.ts";
import { type ConfigSchema, type VariableDeclarationsType } from "../types/ConfigSchema.ts";
import { type ConfigType } from "../types/ConfigType.ts";
import { makeAbsolute } from "../helpers/makeAbsolute.ts";
import { variableFilters } from "./variableFilters.ts";
import { VariableStoreType } from "../types/VariableStoreType.ts";


const regex = {
    variableReplacer: /\$\{(?<name>[A-Z_][A-Z0-9_]*)(\|(?<filter>.+?))?\}/g,
    authenticationReplacer: /^(?<protocol>https?:\/\/)(?<username>.+?)\:(?<password>.+?)@/i
}


/**
 * Parse config file and return a config object.
 * 
 * @param json Content of the config file.
 * @param configRoot Folder where the config file is located.
 * @param separateGitRoot Meta folder where the git repository is located.
 * @returns 
 */
export function parseConfig(json: string, configRoot: string, separateGitRoot: string): ConfigType {
    const config: ConfigType = [];
    const data = JSON.parse(json) as ConfigSchema;
    const commonVars = crateVariables(configRoot, data.variables ?? {});
    const packages = data.packages ?? {};

    for (const reference in packages) {
        // Normalize reference
        const settingsArr = (v => {
            if (v === true || v === null) return [{}];
            if (v === false) return null;

            return Array.isArray(v) ? v : [v];
        })(packages[reference]);

        // Skip if no settings
        if (settingsArr === null) break;

        for (const settings of settingsArr) {
            const localVars = crateVariables(configRoot, settings.variables ?? {});
            const getVariable = createVariableStore(localVars, commonVars);

            const remoteName = basename(reference, '.git');
            const localName = settings.name ?? remoteName;
            const destinationDir = (d => {
                return makeAbsolute(configRoot, join(d, localName));
            })(settings.destination ?? data.destination ?? './');

            const separatedGitDir = join(separateGitRoot, remoteName);
            const tag = settings.tag ?? null;

            config.push({
                reference: apllyVariables(reference, getVariable),
                displayReference: createDisplayReference(apllyVariables(reference, getVariable)),
                tag: tag ? apllyVariables(tag, getVariable) : null,
                name: apllyVariables(localName, getVariable),
                destinationDir: apllyVariables(destinationDir, getVariable),
                separatedGitDir: apllyVariables(separatedGitDir, getVariable),
            });
        }
    }

    return config;
}


/**
 * Transform a reference to a displayable reference. This is useful for hiding authentication information.
 */
function createDisplayReference(s: string): string {
    const authenticationReplacer = /^(?<protocol>https?:\/\/)(?<username>.+?)\:(?<password>.+?)@/i;

    return s.replace(authenticationReplacer, (_match, protocol, username, _password) => {
        return `${protocol}${username}:●●●●●@`;
    });
}


/**
 * Create a map of variables from config declarations.
 * @param root Folder for relative paths.
 * @param declarations 
 * @returns 
 */
function crateVariables(root: string, declarations: VariableDeclarationsType): Map<string, string> {
    const variables = new Map<string, string>();

    for (const [name, value] of Object.entries(declarations)) {
        // TODO: Check if name is valid

        if (typeof value === "string") {
            variables.set(name, value);
        } else {
            const path = makeAbsolute(root, value.from);
            const content = Deno.readTextFileSync(path);

            variables.set(name, content);
        }
    }

    return variables;
}


function createVariableStore(...declarations: Map<string, string>[]): VariableStoreType {
    return (name: string) => {
        for (const declaration of declarations) {
            if (declaration.has(name)) return declaration.get(name);
        }

        return Deno.env.get(name);
    }
}


/**
 * Apply variables to a string.
 */
function apllyVariables(s: string, variableStore: VariableStoreType): string {
    regex.variableReplacer.lastIndex = 0;
    return s.replace(regex.variableReplacer, (_match, _g1, _g2, _g3, _g4, _g5, groups) => {
        const { name, filter } = groups;

        const value = variableStore(name);

        if (value === undefined) return `\$${name}`;
        if (filter === undefined) return value;

        const filterFunc = variableFilters.get(filter);
        if (filterFunc) return filterFunc(value);

        return value;
    });
}
