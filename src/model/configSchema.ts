import * as settings from "../settings.ts";
import { serializeVerionTypeDeclaration } from "../utils/serializeVerionTypeDeclaration.ts";
import { serializeVerionValue } from "../utils/serializeVerionValue.ts";
import { TypeObject } from "./descriptors/TypeObject.ts";
import { createTypeValueRecord } from "./descriptors/createTypeValueRecord.ts";


const stringType: TypeObject = {
    include: false,
    depends: [],
    name: () => `string`,
    optional: () => false,
    serializedDeclaration: () => `string`,
}

const booleanType: TypeObject = {
    include: false,
    depends: [],
    name: () => `boolean`,
    optional: () => false,
    serializedDeclaration: () => `boolean`,
}

const versionType: TypeObject = {
    include: true,
    depends: [],
    name: () => `Version`,
    optional: () => false,
    serializedDeclaration: () => serializeVerionTypeDeclaration(settings.version),
    docComment: () => `TODO: doc comment`,
}

const tagOrBranchType: TypeObject = {
    include: true,
    depends: [],
    name: () => `TagOrBranch`,
    optional: () => false,
    serializedDeclaration: () => `string`,
    docComment: () => `Alias for "string" for better readability.`,
}


export const [dependencyType, dependencyValue] = createTypeValueRecord({
    include: true,
    depends: [tagOrBranchType],
    name: () => `Dependency`,
    optional: () => true,
    docComment: () => `TODO: type doc comment`,
}, {
    docComment: () => `TODO: value doc comment`,
}, {
    destination: {
        type: tagOrBranchType,
    },
    name: {
        type: stringType,
    },
    tag: {
        type: stringType,
    },
    disabled: {
        type: booleanType,
    },
});


// export const dependencyType = {
//     destination: tagOrBranchType,
//     name: stringType,
//     tag: stringType,
//     disabled: booleanType,
// }


export const [configType, configValue] = createTypeValueRecord({
    include: true,
    depends: [versionType, dependencyType],
    name: () => `Config`,
    optional: () => false,
    docComment: () => `TODO: type doc comment`,
}, {
    docComment: () => `TODO: value doc comment`,
}, {
    version: {
        default: () => serializeVerionValue(settings.version),
        type: versionType,
    },
    dependencies: {
        default: () => [],
        type: dependencyType,
    },
});


configType