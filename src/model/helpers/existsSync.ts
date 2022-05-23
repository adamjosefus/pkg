/**
 * @copyright Copyright (c) 2022 Adam Josefus
 */

export const existsSync = (path: string): boolean => {
    try {
        Deno.statSync(path);
        return true;
    } catch (_error) {
        return false;
    }
};
