import { createAsyncFunction } from "./createAsyncFunction.ts";


export const existsSync = (path: string): boolean => {
    try {
        Deno.statSync(path)
        return true;

    } catch (e) {
        if (e instanceof Deno.errors.NotFound) return false

        throw e;
    }
}


export const exists = createAsyncFunction(existsSync);
