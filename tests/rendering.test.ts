import { assertEquals } from "../libs/deno_std/testing/asserts.ts";
import { indent } from "../src2/utils/serializers/indent.ts";
import { tab } from "../src2/utils/serializers/tab.ts";
import { createDocComment, createMultiComment } from "../src2/utils/serializers/comments.ts";



Deno.test("tab", () => {
    assertEquals(tab(0), "");
    assertEquals(tab(1), "    ");
    assertEquals(tab(2), "        ");
});

Deno.test("indent", () => {
    const content = "foo bar";

    assertEquals(indent(content), `    ${content}`);
    assertEquals(indent(content, 0), `${content}`);
    assertEquals(indent(content, -999), `${content}`);
    assertEquals(indent(content, 1), `    ${content}`);
    assertEquals(indent(content, 2), `        ${content}`);
});


Deno.test("createDocComment", () => {
    assertEquals(createDocComment("foo bar"), ["/** foo bar */"]);
    assertEquals(createDocComment("foo\nbar"), [
        "/**",
        " * foo",
        " * bar",
        " */"
    ]);
});

Deno.test("createMultiComment", () => {
    assertEquals(createMultiComment("foo bar"), ["/* foo bar */"]);
    assertEquals(createMultiComment("foo\nbar"), [
        "/*",
        "foo",
        "bar",
        "*/"
    ]);
});