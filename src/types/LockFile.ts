import { Version } from "../types.ts";


type Dependency = {
    reference: string,
    tag: string | null,
    name: string,
}


export type LockFile = Readonly<{
    version: Version<number>,
    dependencies: Readonly<Dependency[]>,
}>;
