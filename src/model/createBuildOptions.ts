import { TransformedConfig } from "../types/TransformedConfig.ts";
import { type Config } from "../types/Config.ts";
import { basenameWithoutExtension } from "../utils/basenameWithoutExtension.ts";
import { deleteUndefined } from "../utils/deleteUndefined.ts";
import { absurd } from "../../libs/esm/fp-ts/function.ts";


/**
 * Creates ESBuild Options for the given preset.
 * 
 * @param preset Preset name
 * @returns ESBuild options
 */
const createPresetBuildOptions = (preset: 'default' | 'package' | 'app'): Omit<TransformedConfig['build'], 'tsconfig'> => {
    switch (preset) {
        case 'default':
            return {
                target: 'esnext',
                format: 'esm',
                minify: false,
                sourcemap: false,
                bundle: false,
            }

        case 'package':
            return {
                target: 'esnext',
                format: 'esm',
                minify: false,
                sourcemap: true,
                bundle: false,
            }

        case 'app':
            return {
                target: 'es2015',
                format: 'esm',
                minify: true,
                sourcemap: true,
                bundle: true,
            }

        default:
            return absurd(preset) as never;
    }
}


/**
 * Creates ESBuild Options for the given config.
 * 
 * @param options Config options
 * @param tsconfigPath Path to tsconfig file
 * @returns ESBuild options
 */
export const createBuildOptions = (options: Config['build'], entryPoints: string[], tsconfigPath: string | undefined): TransformedConfig['build'] => {
    const common = {
        tsconfig: tsconfigPath
    }

    if (options === undefined) {
        const present = createPresetBuildOptions('default');

        return {
            ...deleteUndefined(present),
            ...deleteUndefined(common),
        }
    }

    const present = options.preset ? createPresetBuildOptions(options.preset) : {};
    const esbuild = options.esbuild ?? {};
    const rest: Required<Omit<Config['build'], 'preset' | 'esbuild'>> = {
        bundle: options.bundle ?? false,
        sourceMap: options.sourceMap ?? false,
        minify: options.minify ?? false,
    };

    const result = {
        ...deleteUndefined(present),
        ...deleteUndefined(common),
        ...deleteUndefined(esbuild),
        ...deleteUndefined(rest),
    }

    if (Array.isArray(result.entryPoints)) {
        result.entryPoints = [
            ...entryPoints,
            ...result.entryPoints, // Values from esbuild have higher priority
        ];

    } else if (typeof result.entryPoints === 'object') {
        result.entryPoints = {
            ...Object.fromEntries(entryPoints.map(path => [basenameWithoutExtension(path), path])),
            ...result.entryPoints, // Values from esbuild have higher priority
        };

    } else if (result.entryPoints === undefined) {
        result.entryPoints = entryPoints;
    }


    return result;
}
