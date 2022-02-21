/**
 * @copyright Copyright (c) 2022 Adam Josefus
 */


import { join, basename } from "https://deno.land/std@0.126.0/path/mod.ts";
import { type ConfigSchema, type VariablesType } from "../types/ConfigSchema.ts";
import { type ConfigType } from "../types/ConfigType.ts";
import { makeAbsolute } from "../helpers/makeAbsolute.ts";
import { variableFilters } from "./variableFilters.ts";


const regex = {
    variable: /\$\{(?<name>[A-Z_][A-Z0-9_]*)(\|(?<filter>.+?))?\}/g,
}


export function parseConfig(json: string, configRoot: string, separateGitRoot: string): ConfigType {
    const config: ConfigType = [];
    const data = JSON.parse(json) as ConfigSchema;
    const variables = parseVariables(configRoot, data.variables ?? {});
    const getVariable = createVariableGetter(variables);
    const packages = data.packages ?? {};

    for (const reference in packages) {
        const options = (v => {
            if (typeof v === "boolean") {
                return v ? {} : null
            } else {
                return v;
            }
        })(packages[reference]);

        if (options === null) break;

        const remoteName = basename(reference, '.git');
        const localName = options.name ?? remoteName;
        const destinationDir = (d => {
            return makeAbsolute(configRoot, join(d, localName));
        })(options.destination ?? data.destination ?? './');

        const separatedGitDir = join(separateGitRoot, remoteName);
        const tag = options.tag ?? null;

        config.push({
            reference: apllyVariables(reference, getVariable),
            displayReference: createDisplayReference(apllyVariables(reference, getVariable)),
            tag: tag ? apllyVariables(tag, getVariable) : null,
            name: localName,
            destinationDir: apllyVariables(destinationDir, getVariable),
            separatedGitDir: apllyVariables(separatedGitDir, getVariable),
        });
    }

    return config;
}


function createDisplayReference(s: string): string {
    const authenticationReplacer = /^(?<protocol>https?:\/\/)(?<username>.+?)\:(?<password>.+?)@/i;

    return s.replace(authenticationReplacer, (_match, protocol, username, _password) => {
        return `${protocol}${username}:●●●●●@`;
    });
}


function parseVariables(root: string, list: VariablesType): Map<string, string> {
    const variables = new Map<string, string>();

    for (const [name, value] of Object.entries(list)) {
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


function createVariableGetter(store: Map<string, string>, useEnv = true): (name: string) => string | undefined {
    return (name: string) => {
        if (store.has(name)) return store.get(name);
        if (useEnv) return Deno.env.get(name);

        return undefined;
    }
}


function apllyVariables(s: string, getVariable: (name: string) => string | undefined): string {
    regex.variable.lastIndex = 0;
    return s.replace(regex.variable, (_match, _g1, _g2, _g3, _g4, _g5, groups) => {
        const { name, filter } = groups;

        const value = getVariable(name);

        if (value === undefined) return `\$${name}`;
        if (filter === undefined) return value;

        const filterFunc = variableFilters.get(filter);

        if (filterFunc) {
            return filterFunc(value);
        }
        
        return value;
    });
}
