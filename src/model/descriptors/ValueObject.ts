import { TypeObject } from "./TypeObject.ts";


export interface ValueObject {
    default?: () => unknown,
    docComment?: () => string,
    readonly type: TypeObject,
}
