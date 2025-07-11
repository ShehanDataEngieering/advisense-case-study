import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";

import {
  BinaryOperationNode,
  Identifier,
  NumericLiteral,
} from "../../src/modules/ast.ts";

// Test for NumericLiteral
Deno.test("NumericLiteral should be initialized correctly", () => {
  const numLiteral: NumericLiteral = { type: "NumericLiteral", value: 42 };

  assertEquals(numLiteral.type, "NumericLiteral");
  assertEquals(numLiteral.value, 42);
});

Deno.test("Identifier should be initialized correctly", () => {
  const identifier: Identifier = { type: "Identifier", symbol: "x" };

  assertEquals(identifier.type, "Identifier");
  assertEquals(identifier.symbol, "x");
});

// Test for BinaryOperationNode
Deno.test("BinaryOperationNode should be initialized correctly", () => {
  const leftNode: NumericLiteral = { type: "NumericLiteral", value: 5 };
  const rightNode: NumericLiteral = { type: "NumericLiteral", value: 3 };
  const binaryOp: BinaryOperationNode = {
    type: "BinaryExpr",
    left: leftNode,
    right: rightNode,
    operator: "+",
  };

  assertEquals(binaryOp.type, "BinaryExpr");
  assertEquals(binaryOp.operator, "+");
  assertEquals((binaryOp.left as NumericLiteral).value, 5);
  assertEquals((binaryOp.right as NumericLiteral).value, 3);
});
