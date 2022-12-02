import type { BuildOptions } from "https://raw.githubusercontent.com/evanw/esbuild/master/lib/shared/types.ts";


type AtLeastOne<T, U = {
    [K in keyof T]: Pick<T, K>;
}> = Partial<T> & U[keyof U];


type AccessToken =
    | { file: string }
    | { env: string }
    | { secret: string }
    | string;


export type Config = Partial<{
    version: string,
    watch: boolean,
    outDir: string,
    rootDir: string,
    dependenciesDir: string,
    include: string[],
    exclude: string[],
    build: AtLeastOne<{
        bundle: boolean,
        sourceMap: boolean,
        minify: boolean,
        preset: 'package' | 'app',
        esbuild: BuildOptions,
    }>,
    dependencies: {
        [reference: string]: AtLeastOne<{
            tag: string,
            name: string,
            destination: string,
            accessToken: AccessToken,
        }> | string,
    },
    accessTokens: {
        [origin: string]: AccessToken,
    },
    useGlobalAccessTokens: boolean,
    tsconfig: string,
}>
