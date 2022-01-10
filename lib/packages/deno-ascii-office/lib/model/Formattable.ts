export class Formattable {

    private text: string;
    private formatter: (s: string) => string;


    constructor(text: string, formatter = (s: string): string => s) {
        this.text = text;
        this.formatter = formatter;
    }


    update(callback: (text: string) => string): Formattable {
        this.text = callback(this.text);

        return this;
    }


    toString(): string {
        return this.formatter(this.text);
    }


    get length(): number {
        return this.text.length;
    }


    split(separator: string | RegExp, limit?: number) {
        return this.text.split(separator, limit).map(t => new Formattable(t, this.formatter));
    }

}