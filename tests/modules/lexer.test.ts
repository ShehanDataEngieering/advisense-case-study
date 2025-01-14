import { assertEquals, assertMatch } from "jsr:@std/assert";

import { tokenize, TokenType } from "../../src/modules/lexer.ts";
import { captureConsoleError } from "../utils/testUtils.ts";

// Test: Empty Source Code
Deno.test("Tokenize - Empty Source Code", () => {
  const tokens = tokenize("");
  assertEquals(tokens, [{ type: TokenType.EOF, value: "EndOfFile" }]);
});

// Test: Single Character Tokens
Deno.test("Tokenize - Single Character Tokens", () => {
  const source = "(){};";
  const tokens = tokenize(source);
  const expected = [
    { type: TokenType.OpenParen, value: "(" },
    { type: TokenType.CloseParen, value: ")" },
    { type: TokenType.OpenBrace, value: "{" },
    { type: TokenType.CloseBrace, value: "}" },
    { type: TokenType.Semicolon, value: ";" },
    { type: TokenType.EOF, value: "EndOfFile" },
  ];
  assertEquals(tokens, expected);
});

// Test: Numbers
Deno.test("Tokenize - Numbers", () => {
  const source = "123 456";
  const tokens = tokenize(source);
  const expected = [
    { type: TokenType.Number, value: "123" },
    { type: TokenType.Number, value: "456" },
    { type: TokenType.EOF, value: "EndOfFile" },
  ];
  assertEquals(tokens, expected);
});

// Test: Identifiers
Deno.test("Tokenize -  Identifiers", () => {
  const source = "let x;";
  const tokens = tokenize(source);
  const expected = [
    { type: TokenType.Let, value: "let" },
    { type: TokenType.Identifier, value: "x" },
    { type: TokenType.Semicolon, value: ";" },
    { type: TokenType.EOF, value: "EndOfFile" },
  ];
  assertEquals(tokens, expected);
});

// Test: Binary Operators
Deno.test("Tokenize - Binary  Operators", () => {
  const source = "42 - 3";
  const tokens = tokenize(source);
  const expected = [
    { type: TokenType.Number, value: "42" },
    { type: TokenType.BinaryOperator, value: "-" },
    { type: TokenType.Number, value: "3" },
    { type: TokenType.EOF, value: "EndOfFile" },
  ];
  assertEquals(tokens, expected);
});

Deno.test("Tokenize - Arithmetic Expression with brackets (3 * 2)", () => {
  const source = "(3 * 2)";
  const tokens = tokenize(source);
  const expected = [
    { type: TokenType.OpenParen, value: "(" },
    { type: TokenType.Number, value: "3" },
    { type: TokenType.BinaryOperator, value: "*" },
    { type: TokenType.Number, value: "2" },
    { type: TokenType.CloseParen, value: ")" },
    { type: TokenType.EOF, value: "EndOfFile" },
  ];
  assertEquals(tokens, expected);
});

Deno.test("Tokenize - Handles complex arithmetic expression (3 + 2) - (2 * 3)", () => {
  const source = "(3 + 2) - (2 * 3)";
  const expectedTokens = [
    { type: TokenType.OpenParen, value: "(" },
    { type: TokenType.Number, value: "3" },
    { type: TokenType.BinaryOperator, value: "+" },
    { type: TokenType.Number, value: "2" },
    { type: TokenType.CloseParen, value: ")" },
    { type: TokenType.BinaryOperator, value: "-" },
    { type: TokenType.OpenParen, value: "(" },
    { type: TokenType.Number, value: "2" },
    { type: TokenType.BinaryOperator, value: "*" },
    { type: TokenType.Number, value: "3" },
    { type: TokenType.CloseParen, value: ")" },
    { type: TokenType.EOF, value: "EndOfFile" },
  ];

  const tokens = tokenize(source);

  assertEquals(tokens, expectedTokens);
});

Deno.test("tokenize: should log error for unrecognized character", () => {
  const sourceCode = "@42;";

  // Capture console.error output
  const errorOutput = captureConsoleError(() => {
    tokenize(sourceCode);
  });

  // Assert that the error message is logged correctly
  assertMatch(
    errorOutput,
    /Unrecognized character '@' at position 0/,
    "Error message should indicate the unrecognized character and its position.",
  );
});

Deno.test("tokenize: should tokenize valid parts even with unrecognized character", () => {
  const sourceCode = "@42;";

  // Tokenize the input
  const tokens = tokenize(sourceCode);

  // Assert that the valid tokens are generated correctly
  assertEquals(tokens, [
    { type: TokenType.Number, value: "42" },
    { type: TokenType.Semicolon, value: ";" },
    { type: TokenType.EOF, value: "EndOfFile" },
  ]);
});
