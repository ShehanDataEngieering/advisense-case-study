import { assertEquals, assertThrows } from "jsr:@std/assert";
import Parser from "../../src/modules/parser.ts";
import { BinaryOperationNode, NullLiteral } from "../../src/modules/ast.ts";
import { mockConsoleError } from "../utils/testUtils.ts";

Deno.test("Parser: should parse basic addition", () => {
  const parser = new Parser();
  const ast = parser.produceAST("3 + 2");

  const expectedAST: any = {
    type: "BinaryExpr",
    left: { type: "NumericLiteral", value: 3 },
    right: { type: "NumericLiteral", value: 2 },
    operator: "+",
  };

  assertEquals(ast, expectedAST);
});

Deno.test("Parser: should parse subtraction", () => {
  const parser = new Parser();
  const ast = parser.produceAST("5 - 3");

  const expectedAST: BinaryOperationNode = {
    type: "BinaryExpr",
    left: { type: "NumericLiteral", value: 5 },
    right: { type: "NumericLiteral", value: 3 },
    operator: "-",
  };

  assertEquals(ast, expectedAST);
});

Deno.test("Parser: should parse multiplication", () => {
  const parser = new Parser();
  const ast = parser.produceAST("3 * 4");

  const expectedAST: BinaryOperationNode = {
    type: "BinaryExpr",
    left: { type: "NumericLiteral", value: 3 },
    right: { type: "NumericLiteral", value: 4 },
    operator: "*",
  };

  assertEquals(ast, expectedAST);
});

Deno.test("Parser: should parse expression with parentheses", () => {
  const parser = new Parser();
  const ast = parser.produceAST("(3 + 2) * 4");

  const expectedAST: any = {
    type: "BinaryExpr",
    left: {
      type: "BinaryExpr",
      left: { type: "NumericLiteral", value: 3 },
      right: { type: "NumericLiteral", value: 2 },
      operator: "+",
    },
    right: { type: "NumericLiteral", value: 4 },
    operator: "*",
  };

  assertEquals(ast, expectedAST);
});

Deno.test("Parser: should parse equality comparison", () => {
  const parser = new Parser();
  const ast = parser.produceAST("3 == 3");

  const expectedAST: any = {
    type: "BinaryExpr",
    left: { type: "NumericLiteral", value: 3 },
    right: { type: "NumericLiteral", value: 3 },
    operator: "==",
  };

  assertEquals(ast, expectedAST);
});

Deno.test("Parser: should parse greater than comparison", () => {
  const parser = new Parser();
  const ast = parser.produceAST("5 > 2");

  const expectedAST: any = {
    type: "BinaryExpr",
    left: { type: "NumericLiteral", value: 5 },
    right: { type: "NumericLiteral", value: 2 },
    operator: ">",
  };

  assertEquals(ast, expectedAST);
});

Deno.test("Parser: should parse identifiers", () => {
  const parser = new Parser();
  const ast = parser.produceAST("myVar");

  const expectedAST: any = {
    type: "Identifier",
    symbol: "myVar",
  };

  assertEquals(ast, expectedAST);
});

Deno.test("Parser: should parse null literal", () => {
  const parser = new Parser();
  const ast = parser.produceAST("null");

  const expectedAST: NullLiteral = {
    type: "NullLiteral",
    value: "null",
  };

  assertEquals(ast, expectedAST);
});

// Test for unexpected token after opening parenthesis (triggering hasCloseParenthesis)
Deno.test("Parser: should log error for unexpected token after opening parenthesis", () => {
  const parser = new Parser();

  // Mock console.error to capture and assert the error message
  const originalConsoleError = console.error;
  console.error = mockConsoleError;

  try {
    // Pass an invalid expression to trigger the error inside hasCloseParenthesis
    parser.produceAST("(42"); // This should fail due to missing closing parenthesis
  } catch (error) {
    assertThrows(
      () => {
        throw error;
      },
      Error,
      "Unexpected token found inside parenthesised expression. Expected closing parenthesis.",
    );

    // Restore the original console.error to avoid affecting other tests
    console.error = originalConsoleError;
  }
});
