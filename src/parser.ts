import { Tokenizer } from "./tokenizer";

export class Parser {
    private _string: string;
    private _tokenizer: Tokenizer;
    private _lookahead: { type: string; value: string } | null | undefined;
    private _VALUE_TYPES = ["[", "{", "STRING", "NUMBER", "BOOLEAN", "NULL"];
    /**
     * Parses a string into an object
     */
    constructor() {
        this._tokenizer = new Tokenizer();
        this._string = "";
    }

    parse(input: string): Object {
        this._string = input;
        // Parse recursively starting from the main
        // entry point, the Program:
        this._tokenizer.init(input);
        this._lookahead = this._tokenizer.getNextToken();
        return this.JSON();
    }

    /**
     * Value
     */

    Value(): Object {
        switch (this._lookahead?.type) {
            case "{":
                return this.ObjectLiteral();
            case "[":
                return this.ArrayLiteral();
            case "STRING":
                return this.StringLiteral();
            case "NUMBER":
                return this.NumericLiteral();
            case "BOOLEAN":
                return this.BooleanLiteral();
            case "NULL":
                return this.NullLiteral();
        }
        throw new Error(`Unexpected token ${this._lookahead?.type}`);
    }

    /**
     * JSON
     */
    JSON(): Object {
        switch (this._lookahead?.type) {
            case "{":
                return this.ObjectLiteral();
            case "[":
                return this.ArrayLiteral();
        }
        throw new Error(`Unexpected token ${this._lookahead?.type}`);
    }

    /**
     * Object
     */
    ObjectLiteral(): Object {
        this._eat("{");
        const values = [];
        let commaPresent = this._lookahead?.type === ",";
        while (this._lookahead?.type === "STRING") {
            commaPresent = false;
            values.push(this.AssignmentExpression());
            // @ts-ignore
            if (this._lookahead?.type === ",") {
                this._eat(",");
                commaPresent = true;
            }
        }
        if (!commaPresent && this._lookahead?.type === "}") {
            this._eat("}");
        } else {
            throw new Error(`Unexpected token ${this._lookahead?.type}`);
        }

        return {
            type: "ObjectLiteral",
            values,
        };
    }

    /**
     * Array
     */
    ArrayLiteral(): Object {
        this._eat("[");
        const values = [];
        let commaPresent = this._lookahead?.type === ",";
        while (
            this._VALUE_TYPES.findIndex((x) => x === this._lookahead?.type) >= 0
        ) {
            commaPresent = false;
            values.push(this.Value());
            if (this._lookahead?.type === ",") {
                this._eat(",");
                commaPresent = true;
            }
        }

        if (!commaPresent && this._lookahead?.type === "]") {
            this._eat("]");
        } else {
            throw new Error(`Unexpected token ${this._lookahead?.type}`);
        }

        return {
            type: "ArrayLiteral",
            values,
        };
    }

    /**
     * Assignment Expression
     */
    AssignmentExpression(): Object {
        const left = this.StringLiteral();
        this._eat(":");
        return {
            type: "AssignmentExpression",
            left: left,
            right: this.Value(),
        };
    }

    /**
     * Literal
     *   : NumericLiteral
     *   : StringLiteral
     *
     */
    Literal(): Object {
        switch (this._lookahead?.type) {
            case "NUMBER":
                return this.NumericLiteral();
            case "STRING":
                return this.StringLiteral();
        }

        throw new Error(`Unexpected token ${this._lookahead?.type}`);
    }

    /**
     * StringLiteral
     *   : STRING
     */
    StringLiteral(): Object {
        const token = this._eat("STRING");
        return {
            type: "StringLiteral",
            value: token.value.slice(1, -1),
        };
    }

    /**
     * NumberLiteral
     *   : NUMBER
     */

    NumericLiteral(): Object {
        const token = this._eat("NUMBER");
        return {
            type: "NumericLiteral",
            value: Number(token.value),
        };
    }

    /**
     * BooleanLiteral
     *  : Boolean
     */

    BooleanLiteral(): Object {
        const token = this._eat("BOOLEAN");
        return {
            type: "BooleanLiteral",
            value: token.value === "true",
        };
    }

    /**
     * NullLiteral
     *   : Null
     */
    NullLiteral(): Object {
        const token = this._eat("NULL");
        return {
            type: "NullLiteral",
        };
    }

    /**
     * Eats a token of the given type
     */
    _eat(type: string): { type: string; value: string } {
        const token = this._lookahead;
        if (token == null) {
            throw new Error(`Unexpected end of input, expected ${type}`);
        }

        if (token.type !== type) {
            throw new Error(`Unexpected token ${token.type}, expected ${type}`);
        }
        this._lookahead = this._tokenizer.getNextToken();
        return token;
    }
}
