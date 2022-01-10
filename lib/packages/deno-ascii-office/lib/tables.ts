import { Formattable } from "./model/Formattable.ts";


function custom(data: unknown[][]): string {
    // Utils
    const splitter = /\r\n?|\n/g;

    function transposeArray<T>(a: T[][]): T[][] {
        return Object.keys(a[0]).map(function (c) {
            return a.map(function (r) { return r[parseInt(c, 10)]; });
        });
    }


    // Rendering
    type TableComponentType = {
        type: 'start' | 'separator' | 'end',
    } | {
        type: 'row',
        content: Formattable[],
    }

    function createOpening(widths: number[]): string {
        return widths.map((n, i, arr) => {
            const parts: string[] = [];

            if (i == 0) parts.push('┌');
            else parts.push('┬');

            parts.push(`${Array(n + 1).join('─')}`);

            if (i == arr.length - 1) parts.push('┐');

            return parts.join('');
        }).join('')
    }

    function createClosing(widths: number[]): string {
        return widths.map((n, i, arr) => {
            const parts: string[] = [];

            if (i == 0) parts.push('└');
            else parts.push('┴');

            parts.push(`${Array(n + 1).join('─')}`);

            if (i == arr.length - 1) parts.push('┘');

            return parts.join('');
        }).join('')
    }

    function createLine(cells: Formattable[], widths: number[]): string {
        return cells.map((cell, i, arr) => {
            const s: string[] = [];

            s.push('│');
            s.push(cell.toString());
            s.push(Array(widths[i] - cell.length + 1).join(' '));

            if (i == arr.length - 1) s.push('│');

            return s.join('');

        }).join('')
    }

    function createSeparator(widths: number[]): string {
        return widths.map((n, i, arr) => {
            const parts: string[] = [];

            if (i == 0) parts.push('├');
            else parts.push('┼');

            parts.push(`${Array(n + 1).join('─')}`);

            if (i == arr.length - 1) parts.push('┤');

            return parts.join('');
        }).join('')
    }



    // Data
    const arr = data.map(row => {
        // conver to strings
        return row.map(cell => {
            if (cell instanceof Formattable) {
                return cell;
            } else {
                return new Formattable(typeof cell === 'string' ? cell : Deno.inspect(cell));
            }
        });
    }).map(row => {
        // Add margin spaces
        return row.map(cell => cell.split(splitter).map(l => l.update((s) => ` ${s} `)))
    }).map(row => {
        // Count the number of rows by neighbor.
        const maxCount = row.reduce((n, lines) => Math.max(lines.length, n), 0)

        row.forEach((lines: Formattable[]) => {
            const count = lines.length;
            for (let i = 0; i < maxCount - count; i++) {
                lines.push(new Formattable(''));
            }
        })

        return row;
    }).map(row => transposeArray<Formattable>(row));


    // Table data
    const tableData = arr.reduce((componenets: TableComponentType[], rows, i, arr) => {
        if (i == 0) componenets.push({ type: 'start' });
        if (i > 0) componenets.push({ type: 'separator' });

        rows.forEach(cells => {
            componenets.push({
                type: 'row',
                content: cells
            });
        });

        if (i == arr.length - 1) componenets.push({ type: 'end' });

        return componenets;
    }, []);


    // Widths
    const widths = tableData.reduce((w: number[], row) => {
        if (row.type == 'row') {
            row.content.forEach((cell, i) => {
                w[i] = Math.max(cell.length, w[i] ?? 0);
            });
        }

        return w;
    }, []);


    // Output
    return tableData.map((item) => {
        switch (item.type) {
            case 'start':
                return createOpening(widths);

            case 'separator':
                return createSeparator(widths);

            case 'row':
                return createLine(item.content ?? [], widths);

            case 'end':
                return createClosing(widths);
        }
    }).join('\n');
}


export function classic(data: unknown[][]): string {
    return custom(data);
}