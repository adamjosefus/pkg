import { TypeObject } from "../descriptors/TypeObject.ts";
import { createDocComment } from "./comments.ts";


export const createTypescriptType = (type: TypeObject): string => {
    const name = type.name();
    const declaration = type.serializedDeclaration();

    return [
        ...createDocComment(type.docComment?.() ?? []),
        `type ${name} = ${declaration};`,
    ].join(`\n`);
}
