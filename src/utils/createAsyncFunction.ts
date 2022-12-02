/**
 * Creates an async function that will execute the given function
 */
// deno-lint-ignore no-explicit-any
export const createAsyncFunction = <T extends ((...args: any[]) => any)>(fn: T) => {
    return (...args: Parameters<T>) => {
        return new Promise<ReturnType<T>>((resolve, reject) => {
            try {
                resolve(fn(...args));
            } catch (error) {
                reject(error);
            }
        });
    };
}
