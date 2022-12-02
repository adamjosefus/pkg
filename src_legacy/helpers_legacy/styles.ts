/**
 * @author Adam Josefus
 */

import { bold, brightGreen as green, brightRed as red, yellow, gray } from "../../libs/colors.ts"

type EntryType =
    | [text: string]
    | [template: TemplateStringsArray, ...args: unknown[]]


function str(...entry: EntryType): string {
    const [text, ...args] = entry

    if (typeof text === "string") return text

    return text.reduce((acc, cur, i) => {
        return acc + cur + (args[i] ?? "")
    }, "")
}


export const inline = {
    warn: (...entry: EntryType) => {
        const s = str(...entry)
        return `${yellow(bold(s))}`
    }
}


export const block = {
    note: (s: string | string[]) => {
        const lines = Array.isArray(s) ? s : s.split('\n')

        const first = '  '
        const next = Array(first.length + 1).join(' ')

        const msg = lines.map((line, i) => {
            return `${i === 0 ? first : next} ${line}`
        }).join('\n')

        return gray(msg)
    },
    message: (s: string | string[]) => {
        const lines = Array.isArray(s) ? s : s.split('\n')

        const first = '> '
        const next = Array(first.length + 1).join(' ')

        return lines.map((line, i) => {
            return `${i === 0 ? gray(first) : next} ${line}`
        }).join('\n')
    },
    header: (s: string) => {
        return '\n' + bold(s)
    },
    process: (s: string, status: string, style: "success" | "error" | "warning") => {
        const color = style === "success" ? green : style === "error" ? red : yellow

        const dotCount = Math.max(80 - s.length, 0) + 3
        const dosts = Array(dotCount + 1).join('.')


        return `${gray('╶─')} ${bold(s)} ${gray(dosts)} ${color(status)}`
    }
}


export function list(list: string[]): string {
    const isFirst = (i: number, _arr: unknown[]) => i === 0
    const isLast = (i: number, arr: unknown[]) => i === arr.length - 1
    const isOnly = (i: number, _arr: unknown[]) => i === 0 && i === _arr.length - 1

    const symbols = {
        only: '╶─',
        first: '┌─',
        middle: '├─',
        last: '└─',
    }

    return list.map((line, i, arr) => {
        const symbol = (() => {
            if (isOnly(i, arr)) return symbols.only
            if (isFirst(i, arr)) return symbols.first
            if (isLast(i, arr)) return symbols.last
            return symbols.middle
        })()

        return `${symbol} ${line}`
    }).join('\n')
}
