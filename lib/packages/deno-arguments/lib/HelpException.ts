import { ArgumentException } from "./ArgumentException.ts";

export class HelpException extends ArgumentException {
    constructor(message: string) {
        console.log('\n\n');
        console.log(message);
        console.log('\n\n');

        super(message);
    }
}