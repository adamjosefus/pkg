export interface TypeObject {
    readonly include: boolean,
    readonly depends: readonly TypeObject[],
    name: () => string,
    optional: () => boolean,
    serializedDeclaration: () => string,
    docComment?: () => string,
}
