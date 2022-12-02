import { pipe, absurd } from "../../libs/esm/fp-ts/function.ts";
import { dirname } from "../../libs/deno_std/path/mod.ts";
import { JSONC } from "../../libs/esm/jsonc-parser/mod.ts";
import { Cache } from "../../libs/deno_x/allo_caching.ts";
import { type Config } from "../types/Config.ts";
import { computeJsoncErrorMessage } from "../utils/computeJsoncErrorMessage.ts";
import { type ConfigFormat } from "./computeConfigFormat.ts";
import { transformConfig } from "./transformConfig.ts";
import { TransformedConfig } from "../types/TransformedConfig.ts";


/**
 * Class-type for config not found errors for better error handling.
 */
export class ConfigNotFound extends Error {
    constructor(path: string) {
        super(`Config file not found: ${path}`);
    }
}


/**
 * Class-type for config parse errors for better error handling.
 */
export class ConfigParseError extends Error {
    constructor(message: string) {
        super(message);
    }
}


/**
 * Loads a config file from the given path.
 * 
 * @trows `ConfigNotFound` if the config file is not found
 * @trows `ConfigParseError` if the config file is not valid JSONC
 * @param path Path to config file
 * @returns Parsed config content
 */
const createJsoncLoader = (path: string) => async (): Promise<Config> => {
    try {
        const content = await Deno.readTextFile(path);

        try {
            const errors: JSONC.ParseError[] = [];
            const result = JSONC.parse(content, errors, { allowTrailingComma: true }) as unknown;

            if (errors.length > 0) {
                const messages = errors.map(err => computeJsoncErrorMessage(content, err));

                throw new ConfigParseError(messages.join('\n'));
            }

            return result as Config;

        } catch (_err) {
            throw new ConfigParseError(`Failed to parse config file: ${path}`);
        }
    } catch (err) {
        if (err instanceof Deno.errors.NotFound) {
            throw new ConfigNotFound(path);
        }

        throw err;
    }
}


/**
 * Import config file from the given path.
 * 
 * @param path Path to config file with ES module
 * @returns Parsed config content
 */
const createEsmLoader = (path: string) => async (): Promise<Config> => {
    try {
        const { isFile } = await Deno.stat(path);

        if (!isFile) {
            throw new ConfigNotFound(path);
        }

        try {
            const mod = await import(path);
            return mod.default as Config;

        } catch (_err) {
            throw new ConfigParseError(`Failed to parse config file: ${path}`);
        }

    } catch (err) {
        if (err instanceof Deno.errors.NotFound) {
            throw new ConfigNotFound(path);
        }

        throw err;
    }
}


const pickLoaderByFormat = (configFile: string, configFormat: ConfigFormat) => {
    switch (configFormat) {
        case 'jsonc': return createJsoncLoader(configFile);
        case 'esm': return createEsmLoader(configFile);

        default:
            return absurd(configFormat) as never;
    }
}


/**
 * Create config loader.
 * 
 * @param configFile Path to config file
 * @param configFormat Config file format
 * @returns 
 */
export const createConfigLoader = (configFile: string, configFormat: ConfigFormat) => {
    const cache = new Cache<TransformedConfig>();
    const cacheKey = configFile;
    const configRoot = dirname(configFile);

    return async () => {
        if (cache.has(cacheKey)) return cache.load(cacheKey)!; // Exclamation mark is OK, because we check for existence before

        const loader = pickLoaderByFormat(configFile, configFormat);
        const config = await pipe(
            await loader(),
            c => transformConfig(c, configRoot),
        );

        cache.save(cacheKey, config, {
            files: [configFile],
        });

        return config;
    }
}
