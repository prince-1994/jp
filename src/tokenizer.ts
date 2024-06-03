/**
 * Tokenizer class
 *
 * Lazily pulls a token from a stream.
 */

const Spec = [
    // Whitespace
    { reg: /^\s+/, tokenType: null },
    // Comments:

    // // single line
    // { reg: /^\/\/.*/, tokenType: null },

    // // Multi-line
    // { reg: /^\/\*[\s\S]*?\*\//, tokenType: null },

    // comma
    { reg: /^,/, tokenType: "," },

    // Array end token
    { reg: /^]/, tokenType: "]" },

    // Object end token
    { reg: /^}/, tokenType: "}" },

    // Object Start token
    { reg: /^{/, tokenType: "{" },

    // Array Start token
    { reg: /^\[/, tokenType: "[" },

    // Assignment operator
    { reg: /^:/, tokenType: ":" },

    // Assignment
    // { reg: /^"[^"]*":.*/, tokenType: "ASSIGNMENT" },

    // Numbers
    { reg: /^\d+/, tokenType: "NUMBER" },

    // Strings
    { reg: /^"[^"]*"/, tokenType: "STRING" },
    // { reg: /^'[^']*'/, tokenType: "STRING" },

    // Booleans
    { reg: /^(true|false)/, tokenType: "BOOLEAN" },

    // Null
    { reg: /^null/, tokenType: "NULL" },
];

export class Tokenizer {
    private _string!: string;
    private _cursor!: number;
    /**
     * Iniatializes the string
     */
    init(input: string) {
        this._string = input;
        this._cursor = 0;
    }

    /**
     * Checks if we are at the end of the string
     */
    isEOF() {
        return this._cursor === this._string.length;
    }

    /**
     * Whether we still have more tokens.
     */
    hasMoreTokens() {
        return this._cursor < this._string.length;
    }

    /**
     * Obtains next token
     */
    getNextToken(): { type: string; value: string } | null {
        if (!this.hasMoreTokens()) {
            return null;
        }
        const cur_string = this._string.slice(this._cursor);
        for (const { reg, tokenType } of Spec) {
            const token = this._match(reg, cur_string);
            if (token == null) {
                continue;
            }

            if (tokenType == null) {
                return this.getNextToken();
            }
            return {
                type: tokenType,
                value: token,
            };
        }
        throw new SyntaxError(`Unexpected token ${cur_string[0]}`);
    }

    /**
     * Matches a token for a regular expression
     */
    _match(regexp: RegExp, token: string) {
        const matched = regexp.exec(token);
        if (matched === null) {
            return null;
        }
        this._cursor += matched[0].length;
        return matched[0];
    }
}
