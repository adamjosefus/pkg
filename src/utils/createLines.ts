export const createLines = (s: string | string[] | null): string[] => {
    if (s === null) return [];

    const lines = [s].flat()
        .map(s => s.split(`\n`))
        .flat();

    return lines;
}
