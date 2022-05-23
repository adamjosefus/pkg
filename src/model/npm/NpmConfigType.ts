/**
 * @copyright Copyright (c) 2022 Adam Josefus
 */


/**
 * Schema for Node configuration file `package.json`.
 */
export type NpmConfigType = Partial<{
    name: string,
    version: string,
    description: string,
    author: string,
    type: string,
    dependencies: Record<string, string>,
    devDependencies: Record<string, string>,
    engines: {
        node: string,
    }
}>;
