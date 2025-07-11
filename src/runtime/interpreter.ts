import { BoolVal, NullVal, NumberVal, RuntimeVal } from "./values.ts";
import {
  ASTNode,
  BinaryOperationNode,
  NumericLiteral,
  Program,
} from "../modules/ast.ts";

function evaluateProgramme(program: Program): RuntimeVal {
  let lastEvaluated: RuntimeVal = { type: "null", value: "null" } as NullVal;
  for (const statement of program.body) {
    lastEvaluated = evaluateASTNode(statement);
  }
  return lastEvaluated;
}

/**
 * Evaluate comparison operations.
 */
function eval_comparison_expr(
  lhs: NumberVal,
  rhs: NumberVal,
  operator: string,
): BoolVal {
  let result: boolean;
  if (operator == "<") {
    result = lhs.value < rhs.value;
  } else if (operator == ">") {
    result = lhs.value > rhs.value;
  } else if (operator == "<=") {
    result = lhs.value <= rhs.value;
  } else if (operator == ">=") {
    result = lhs.value >= rhs.value;
  } else if (operator == "==") {
    result = lhs.value == rhs.value;
  } else {
    result = lhs.value != rhs.value;
  }

  return { value: result, type: "boolean" };
}

/**
 * Evaulate pure numeric operations with binary operators.
 */
function eval_numeric_binary_expr(
  lhs: NumberVal,
  rhs: NumberVal,
  operator: string,
): NumberVal {
  let result: number;
  if (operator == "+") {
    result = lhs.value + rhs.value;
  } else if (operator == "-") {
    result = lhs.value - rhs.value;
  } else if (operator == "*") {
    result = lhs.value * rhs.value;
  } else if (operator == "/") {
    if (rhs.value === 0) {
      throw new Error("Division by zero is not allowed.");
    }

    result = lhs.value / rhs.value;
  } else {
    result = lhs.value % rhs.value;
  }

  return { value: result, type: "number" };
}

/**
 * Evaulates expressions following the binary operation type.
 */
function evaluateBinaryExpression(binop: BinaryOperationNode): RuntimeVal {
  const lhs = evaluateASTNode(binop.left);
  const rhs = evaluateASTNode(binop.right);

  // Only currently support numeric operations
  if (lhs.type == "number" && rhs.type == "number") {
    if (
      binop.operator === "+" || binop.operator === "-" ||
      binop.operator === "*" || binop.operator === "/" || binop.operator === "%"
    ) {
      return eval_numeric_binary_expr(
        lhs as NumberVal,
        rhs as NumberVal,
        binop.operator,
      );
    }
    // Now handle comparison operations (lower precedence)
    return eval_comparison_expr(
      lhs as NumberVal,
      rhs as NumberVal,
      binop.operator,
    );
  }

  // One or both are NULL
  return { type: "null", value: "null" } as NullVal;
}

export function evaluateASTNode(astNode: ASTNode): RuntimeVal {
  switch (astNode.type) {
    case "NumericLiteral":
      return {
        value: ((astNode as NumericLiteral).value),
        type: "number",
      } as NumberVal;
    case "NullLiteral":
      return { value: "null", type: "null" } as NullVal;
    case "BinaryExpr":
      return evaluateBinaryExpression(astNode as BinaryOperationNode);
    /**
   * still not implemented the full functionality handle multipule statements

    case "Program":
      return evaluateProgramme(astNode as Program);
     * **/
    default:
      throw new Error(
        `This AST Node has not yet been setup for interpretation: ${JSON.stringify(astNode)}`,
      );
  }
}
