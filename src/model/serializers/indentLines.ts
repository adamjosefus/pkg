import { createLines } from "../createLines.ts";
import { indent } from "./indent.ts";


export const indentLines = (content: string, skipFirst = false) => createLines(content).map((l, i) => skipFirst && i === 0 ? l : indent(l, 1)).join(`\n`);
