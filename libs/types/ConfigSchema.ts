/**
 * @copyright Copyright (c) 2022 Adam Josefus
 */


export type VariableDeclarationsType = Record<string, string | {
    from: string,
}>;


type PackageType = {
    destination?: string,
    name?: string,
    tag?: string,
    variables?: VariableDeclarationsType,
};


type PackageMapType = Record<string, PackageType | PackageType[] | boolean | null>;


export type ConfigSchema = {
    destination?: string,
    variables?: VariableDeclarationsType,
    packages?: PackageMapType,
};
