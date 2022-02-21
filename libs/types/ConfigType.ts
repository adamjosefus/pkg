/**
 * @copyright Copyright (c) 2022 Adam Josefus
 */


export type ConfigType = {
    readonly reference: string;
    readonly displayReference: string;
    readonly tag: string | null;
    readonly name: string,
    readonly destinationDir: string,
    readonly separatedGitDir: string,
}[];
