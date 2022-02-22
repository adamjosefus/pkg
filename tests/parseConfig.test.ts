import { assertEquals } from "https://deno.land/std@0.126.0/testing/asserts.ts";
import { parseConfig } from "../libs/model/parseConfig.ts";


Deno.test("parseConfig", () => {
    const configRoot = '/packages';
    const separateGitRoot = '/meta';


    const exercises: {
        label: string,
        json: string,
        expected: unknown,
    }[] = [
        {
            label: "Test 1",
            json: `{}`,
            expected: [],
        },
        {
            label: "Test 2",
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
        {
            label: "Test 3",
            json: `{
                "repositories": {
                    "https://github.com/my-repo.git": false
                }
            }`,
            expected: [],
        },
        {
            label: "Test 4",
            json: `{
                "repositories": {
                    "https://github.com/my-repo.git": null
                }
            }`,
            expected: [],
        },
        {
            label: "Test 5",
            json: `{
                "repositories": {
                    "https://github.com/my-repo.git": true
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

    exercises.forEach(({ json, expected, label }) => {
        const config = parseConfig(json, configRoot, separateGitRoot);
        assertEquals(config, expected, label);
    });
});