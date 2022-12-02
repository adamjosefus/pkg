export const deleteUndefined = <T>(obj: T) => {
    const result = { ...obj };
 
    for (const key in result) {
        if (result[key] === undefined || result[key] === null) {
            delete result[key];
        }
    }
 
    return result;
}
