/**
 * @copyright Copyright (c) 2022 Adam Josefus
 */

export const exists = async (path: string): Promise<boolean> => {
    try {
        await Deno.stat(path);
        return true;
    } catch (_error) {
        return false;
    }
};
