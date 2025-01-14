// Represents tokens that our language understands in parsing.
export enum TokenType {
  // Literal Types
  Null,
  Number,
  Identifier,
  UnaryOperator,

  // Keywords
  Let,

  // Grouping * Operators
  BinaryOperator,
  Equals,
  OpenParen,
  CloseParen,
  OpenBrace,
  CloseBrace,
  Semicolon,
  EOF, // Signified the end of file
}

/**
 * Constant lookup for keywords and known identifiers + symbols.
 */
const KEYWORDS: Record<string, TokenType> = {
  let: TokenType.Let,
  null: TokenType.Null,
};

// Represents a single token from the source-code.
export interface Token {
  value: string; // contains the raw value as seen inside the source code.
  type: TokenType; // tagged structure.
}

// Returns a token of a given type and value
function token(value = "", type: TokenType): Token {
  return { value, type };
}

/**
 * Returns whether the character passed in alphabetic -> [a-zA-Z]
 */
function isAlphabetical(src: string): boolean {
  return src.toUpperCase() != src.toLowerCase();
}

/**
 * Returns true if the character is whitespace like -> [\s, \t, \n]
 */
function isSkippable(str: string): boolean {
  return str === " " || str === "\n" || str === "\t";
}

/**
 Return whether the character is a valid integer -> [0-9]
 */
function isInteger(str: string) {
  const c = str.charCodeAt(0);
  const bounds = ["0".charCodeAt(0), "9".charCodeAt(0)];
  return c >= bounds[0] && c <= bounds[1];
}

/**
 * Given a string representing source code: Produce tokens and handles
 * possible unidentified characters.
 *
 * - Returns a array of tokens.
 * - Does not modify the incoming string.
 */
export function tokenize(sourceCode: string): Token[] {
  const tokens: Token[] = [];

  let index = 0;
  const peek = () => sourceCode[index];
  const advance = () => sourceCode[index++];
  const isEnd = () => index >= sourceCode.length;

  while (!isEnd()) {
    const char = peek();

    if (char === "(") {
      tokens.push(token(advance(), TokenType.OpenParen));
    } else if (char === ")") {
      tokens.push(token(advance(), TokenType.CloseParen));
    } else if (char === "{") {
      tokens.push(token(advance(), TokenType.OpenBrace));
    } else if (char === "}") {
      tokens.push(token(advance(), TokenType.CloseBrace));
    } else if (char === ";") {
      tokens.push(token(advance(), TokenType.Semicolon));
    } else if ("+-*/%<>=".includes(char)) {
      let op = advance();
      if (op === "-" && (index === 0)) {
        tokens.push(token(op, TokenType.UnaryOperator));
      } else if ("=<!".includes(peek())) {
        op += advance();
        tokens.push(token(op, TokenType.BinaryOperator));
      } else {
        tokens.push(token(op, TokenType.BinaryOperator));
      }
    } else if (char === "=") {
      tokens.push(token(advance(), TokenType.Equals));
    } else if (isInteger(char)) {
      let num = "";
      while (!isEnd() && isInteger(peek())) num += advance();
      tokens.push(token(num, TokenType.Number));
    } else if (isAlphabetical(char)) {
      let ident = "";
      while (!isEnd() && (isAlphabetical(peek()) || isInteger(peek()))) {
        ident += advance();
      }
      tokens.push(
        KEYWORDS[ident] !== undefined
          ? token(ident, KEYWORDS[ident])
          : token(ident, TokenType.Identifier),
      );
    } else if (isSkippable(char)) {
      advance();
    } else {
      console.error(`Unrecognized character '${char}' at position ${index}`);
      advance();
    }
  }

  tokens.push({ type: TokenType.EOF, value: "EndOfFile" });
  return tokens;
}
