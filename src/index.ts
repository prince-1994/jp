import { Parser } from "./parser";

export async function main() {
    try {
        const chunks = [];
        // @ts-ignore: Type 'ReadableStream<Uint8Array>' must have a '[Symbol.asyncIterator]()'
        //method that returns an async iterator.ts(2504)
        for await (const chunk of Bun.stdin.stream()) {
            chunks.push(Buffer.from(chunk));
        }
        const input = Buffer.concat(chunks).toString();
        const parser = new Parser();
        return parser.parse(input);
    } catch (e) {
        console.log((e as Error).message);
        process.exit(1);
    }
}

main();
