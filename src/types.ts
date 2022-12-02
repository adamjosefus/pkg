export type ArrayElement<ArrayType extends readonly unknown[]> =
    ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type ObjectValue<RecordType extends { [key: string]: unknown }> =
    RecordType extends { [key: string]: infer ValueType } ? ValueType : never;

export type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K>; }> =
    Partial<T> & U[keyof U];

export type NoUndefinedField<T> =
    { [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>> };


export type Version<T extends number> = Readonly<{
    major: T,
    minor: number,
    patch: number,
    flag?: string,
}>;
