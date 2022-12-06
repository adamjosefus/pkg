import * as esbuild from "../../libs/deno_x/esbuild.ts";
import { Version } from "../types.ts";


type Dependency = {
    reference: string,
    absDestination: string,
    tag: string | null,
    name: string,
    accessTokens: string[],
}

type AccessToken = {
    origin: string,
    secret: string,
}

export type TransformedConfig = Readonly<{
    version: Version<number>,
    watch: boolean,
    absOutDir: string,
    absSourceDir: string,
    build: Readonly<esbuild.BuildOptions>,
    dependencies: Readonly<Dependency[]>,
    filesToWatch: Readonly<string[]>,
}>
