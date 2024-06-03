import { expect, test } from "bun:test";
import { Parser } from "../src/parser.ts";
import { Glob } from "bun";

const glob = new Glob("tests/testcases/**/*.json");
const parser = new Parser();
// Scans the current working directory and each of its sub-directories recursively
for await (const file of glob.scan(".")) {
    const text = await Bun.file(`./${file}`).text();

    test("file", () => {
        const result = expect(() => parser.parse(text));
        if (file.split("/").slice(-1)[0].includes("invalid")) {
            result.toThrow(Error);
        } else {
            result.toBeObject();
        }
    });
}
