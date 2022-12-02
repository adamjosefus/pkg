/**
 * @author Adam Josefus
 */

type AnswersType<T> = {
    [label: string]: () => T
}


/**
 * Ask the user to choose an answer from the given list of answers.
 * First answer is the default answer.
 * 
 * ```ts
 * const result = ask('Are you sure?', {
 *     'y': () => true,
 *     'n': () => false,
 * })
 * ```
 * 
 * @param question The question to ask.
 * @param answers Map of answers with callback functions.
 * @returns 
 */
export function ask<T>(question: string, answers: AnswersType<T>) {
    const answersEntries = Object.entries(answers).map(([label, callback]) => ({ label, callback }))
    const labels = answersEntries.map(({ label }) => label.toLowerCase())
    const defaultLabel = labels[0]

    let result = ""

    while (true) {
        const msg = `${question} (${labels.map((s, i) => i === 0 ? s.toUpperCase() : s).join('/')})`

        result = (v => {
            if (v === null) return defaultLabel

            return v.toLowerCase()
        })(prompt(msg, defaultLabel))

        if (result && labels.includes(result)) break
    }

    return answers[result]()
}
