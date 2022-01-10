import { parse } from "https://deno.land/std@0.117.0/flags/mod.ts";
import { ArgumentException } from "./ArgumentException.ts";
import { HelpException } from "./HelpException.ts";
import { ValueException } from "./ValueException.ts";


export type ExpectationProcessorType<V> = {
    // deno-lint-ignore no-explicit-any
    (value: any): V;
}


export type ExpectationType<V = unknown> = {
    name: string | string[],
    fallback?: V,
    description?: string,
    processor?: ExpectationProcessorType<V>
}


export class Arguments {
    // deno-lint-ignore no-explicit-any
    private raw: any;

    private expectations: {
        names: string[],
        description: string | null,
        fallback: unknown | null,
        processor: ExpectationProcessorType<unknown>
    }[] = [];


    private desciprion: string | null = null;


    constructor(...expectations: ExpectationType[]) {
        this.expectations = this.createExpectations(expectations)

        this.raw = parse(Deno.args);
    }


    private createExpectations(expectation: ExpectationType[]) {
        return expectation.map(ex => {
            const names = ((n) => {
                if (typeof n == 'string')
                    return n.trim().split(/\s+|\s*,\s*/g);
                else
                    return n.map(m => m.trim());
            })(ex.name);

            const description = ((des) => {
                if (des) return des.trim();
                return null;
            })(ex.description);

            const fallback = ex.fallback ?? null;
            
            const processor = ex.processor ?? ((v) => v);

            return {
                names,
                description,
                fallback,
                processor
            }
        });
    }


    getRaw(...names: string[]) {
        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            if (this.raw[name] !== undefined) return this.raw[name];
        }

        return undefined;
    }


    get<V>(name: string): V {
        const expectation = this.expectations.find(ex => ex.names.find(n => n === name));

        if (!expectation) throw new Error(`Argument "${name}" is not found.`);

        const value = this.getRaw(...expectation.names);
        return expectation.processor(value ?? expectation.fallback) as V;
    }


    shouldHelp(): boolean {
        return !!this.getRaw('help');
    }


    setDescription(description: string) {
        this.desciprion = description;
    }


    getHelpMessage(): string {
        const docs = this.expectations.map(ex => {
            const names = ex.names.map(n => `--${n}`).join(', ')

            const lines = [];
            lines.push(`  ${names}`);

            if (ex.description) {
                lines.push(`        ${ex.description}`);
            }

            return ['', ...lines, ''].join('\n');
        }).join('\n');

        return [this.desciprion ?? '', docs]
            .filter(s => s !== '')
            .join('\n');
    }


    triggerHelpException() {
        throw new HelpException(this.getHelpMessage());
    }


    static createValueException(message: string): ValueException {
        return new ValueException(message);
    }

    static isArgumentException(error: Error): boolean {
        return error instanceof ArgumentException;
    }
}