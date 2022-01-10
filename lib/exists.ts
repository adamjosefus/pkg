export const exists = async (path: string): Promise<boolean> => {
    try {
        await Deno.stat(path);

        return true;
    } catch (error) {
        if (error instanceof Deno.errors.NotFound) return false;
        else throw error;
    }
};


export const existsSync = (path: string): boolean => {
    try {
        Deno.statSync(path);

        return true;
    } catch (error) {
        if (error instanceof Deno.errors.NotFound) return false;
        else throw error;
    }
};