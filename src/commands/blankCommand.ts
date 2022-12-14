import * as render from "../utils/render.ts";


export const blankCommand = () => {
    render.botPet(`I did nothing. Use --help to see available commands.`, 'sad');
}

``