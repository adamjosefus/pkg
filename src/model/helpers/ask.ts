/**
 * @copyright Copyright (c) 2022 Adam Josefus
 */

type AnswersType<T> = {
    [label: string]: () => T;
}


/**
 * Ask the user to choose an answer from the given list of answers.
 * First answer is the default answer.
 * 
 * ```ts
 * const result = ask('Are you sure?', {
 *     'y': () => true,
 *     'n': () => false,
 * });
 * ```
 * 
 * @param question The question to ask.
 * @param answers Map of answers with callback functions.
 * @returns 
 */
export function ask<T>(question: string, answers: AnswersType<T>) {
    const labels = Object.keys(answers);
    const defaultLabel = labels[0];

    let result: string | null = null;

    while (true) {
        const msg = `${question} (${labels.map((s, i) => i === 0 ? s.toUpperCase() : s).join('/')})`;
        result = prompt(msg, defaultLabel);

        if (result && labels.map(l => l.toLowerCase()).includes(result.toLowerCase())) break;
    }

    return answers[result]();
}
