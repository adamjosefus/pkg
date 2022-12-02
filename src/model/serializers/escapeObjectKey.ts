export const escapeObjectKey = (key: string) => {
    const nonStandard = /[^A-z0-9_]|^[0-9]/;

    if (nonStandard.test(key)) {
        // Escape double quotes and wrap in quotes if key is not standard. E.g. `123-"foo"-bar` -> `"123-\"foo\"-bar"`
        return `"${key.replaceAll(`"`, `\\"`)}"`;
    }

    return key;
}
