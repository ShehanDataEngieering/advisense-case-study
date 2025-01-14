import { assert, assertEquals, assertThrows } from "jsr:@std/assert";

import {
  BinaryOperationNode,
  NullLiteral,
  NumericLiteral,
  Program,
} from "../../src/modules/ast.ts";
import { evaluateASTNode } from "../../src/runtime/interpreter.ts";
import { BoolVal, NullVal, NumberVal } from "../../src/runtime/values.ts";

// Test for binary numeric addition
Deno.test("evaluateASTNode: should evaluate numeric binary addition", () => {
  const binopNode: BinaryOperationNode = {
    type: "BinaryExpr",
    operator: "+",
    left: { type: "NumericLiteral", value: 5 },
    right: { type: "NumericLiteral", value: 3 },
  };
  const result: any = evaluateASTNode(binopNode);
  assertEquals(result, { type: "number", value: 8 } as NumberVal);
});

// Test for binary numeric subtraction
Deno.test("evaluateASTNode: should evaluate numeric binary subtraction", () => {
  const binopNode: BinaryOperationNode = {
    type: "BinaryExpr",
    operator: "-",
    left: { type: "NumericLiteral", value: 5 },
    right: { type: "NumericLiteral", value: 3 },
  };
  const result = evaluateASTNode(binopNode);
  assertEquals(result, { type: "number", value: 2 } as NumberVal);
});

// Test for binary comparison operation
Deno.test("evaluateASTNode: should evaluate binary comparison operation (>)", () => {
  const binopNode: BinaryOperationNode = {
    type: "BinaryExpr",
    operator: ">",
    left: { type: "NumericLiteral", value: 5 },
    right: { type: "NumericLiteral", value: 3 },
  };
  const result = evaluateASTNode(binopNode);
  assertEquals(result, { type: "boolean", value: true } as BoolVal);
});

// Test for division by zero (should throw an error)
Deno.test("evaluateASTNode: should throw error for division by zero", () => {
  const binopNode: BinaryOperationNode = {
    type: "BinaryExpr",
    operator: "/",
    left: { type: "NumericLiteral", value: 5 },
    right: { type: "NumericLiteral", value: 0 },
  };
  assertThrows(
    () => {
      evaluateASTNode(binopNode);
    },
    Error,
    "Division by zero is not allowed.",
  );
});
