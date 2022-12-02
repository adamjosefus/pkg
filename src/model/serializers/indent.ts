import { tab } from "./tab.ts";


export const indent = (content: string, depth = 1) => `${tab(depth)}${content}`;
