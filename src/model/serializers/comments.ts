import { createLines } from "../createLines.ts";


export const createDocComment = (...s: Parameters<typeof createLines>): string[] => {
    const lines = createLines(...s);
    if (lines.length === 0) return [];

    const before = "/**";
    const prefix = " * ";
    const after = " */";

    if (lines.length === 1) {
        return [`${before} ${lines[0]}${after}`];
    }

    return [before, ...lines.map(l => `${prefix}${l}`), after];
}


export const createMultiComment = (...s: Parameters<typeof createLines>): string[] => {
    const lines = createLines(...s);
    if (lines.length === 0) return [];

    const before = "/*";
    const after = "*/";

    if (lines.length === 1) {
        return [`${before} ${lines[0]} ${after}`];
    }

    return [before, ...lines.map(l => `${l}`), after];
}


export const createSingleComment = (...s: Parameters<typeof createLines>): string[] => {
    const lines = createLines(...s);
    if (lines.length === 0) return [];

    return [...lines.map(l => `// ${l}`)];
}
