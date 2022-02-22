import { assertEquals } from "https://deno.land/std@0.126.0/testing/asserts.ts";
import { parseConfig } from "../libs/model/parseConfig.ts";


Deno.test("parseConfig", () => {
    const configRoot = '/packages';
    const separateGitRoot = '/meta';


    const exercises = [
        {
            json: `{
                "repositories": {
                    "https://github.com/my-repo.git": {

                    }
                }
            }`,
            expected: [
                {
                    destinationDir: "/packages/my-repo",
                    displayReference: "https://github.com/my-repo.git",
                    name: "my-repo",
                    reference: "https://github.com/my-repo.git",
                    separatedGitDir: "/meta/my-repo",
                    tag: null,
                },
            ],
        },
    ];

    exercises.forEach((exercise) => {
        const config = parseConfig(exercise.json, configRoot, separateGitRoot);
        assertEquals(config, exercise.expected);
    });
});