export const list = (list: string[]) => list.map(line => `• ${line}`).join('\n');
