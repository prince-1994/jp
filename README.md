# JP

This is solution for the 2nd challenge on CodingChallenges series by John Crickett.
https://codingchallenges.fyi/challenges/challenge-json-parser

Challenge - Build Your Own JSON Parser

## Description

This repo is an implementation of json parser in Typescript using bun.js as runtime. The `src/jp.ts` implements the parsing logic. The `index.ts` implements a wrapper to be used from command line.

## Install dependencies

To install dependencies:

```bash
bun i
```

## Run Tests

The project features an automated tests system Where you can add a testcase file onn any path inside testcases and it will test the contents of the file to be valid json. If the filename contains invalid, it will test the contents of the file to be invalid json

```bash
bun test
```
