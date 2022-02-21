/**
 * @copyright Copyright (c) 2022 Adam Josefus
 */


type VariablesType = Record<string, string | {
    from: string,
}> | string;


type PackageType = {
    destination?: string,
    name?: string,
    tag?: string,
    variables?: VariablesType,
} | boolean;


type PackageMapType = Record<string, PackageType>;


export type ConfigSchema = {
    destination?: string,
    variables?: VariablesType,
    packages?: PackageMapType,
};