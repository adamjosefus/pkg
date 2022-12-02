import { type ParseErrorCode, printParseErrorCode } from "https://esm.sh/jsonc-parser@3.2.0";
export * as JSONC from "https://esm.sh/jsonc-parser@3.2.0";


export const parseErrorReaon = (code: ParseErrorCode) => {
    const key = printParseErrorCode(code);

    switch (key) {
        case 'InvalidSymbol': return 'Invalid symbol';
        case 'InvalidNumberFormat': return 'Invalid number format';
        case 'PropertyNameExpected': return 'Property name expected';
        case 'ValueExpected': return 'Value expected';
        case 'ColonExpected': return 'Colon expected';
        case 'CommaExpected': return 'Comma expected';
        case 'CloseBraceExpected': return 'Close brace expected';
        case 'CloseBracketExpected': return 'Close bracket expected';
        case 'EndOfFileExpected': return 'End of file expected';
        case 'InvalidCommentToken': return 'Invalid comment token';
        case 'UnexpectedEndOfComment': return 'Unexpected end of comment';
        case 'UnexpectedEndOfString': return 'Unexpected end of string';
        case 'UnexpectedEndOfNumber': return 'Unexpected end of number';
        case 'InvalidUnicode': return 'Invalid Unicode';
        case 'InvalidEscapeCharacter': return 'Invalid escape character';
        case 'InvalidCharacter': return 'Invalid character';

        default: return `Unknown error (${code})`;
    }
}
