// deno-lint-ignore-file no-empty-interface

// --------------          AST TYPES        ------------------
// ---     Defines the structure of our languages AST      ---
// -----------------------------------------------------------

export type NodeType =
  | "Program"
  | "NumericLiteral"
  | "NullLiteral"
  | "Identifier"
  | "UnaryExpr"
  | "BinaryExpr";

export interface Statement {
  type: NodeType;
}

/**
 * Programme works with multiple stalemates . but not implemented in this level
 */
export interface Program {
  body: Statement[];
}

export interface ASTNode {
  type: NodeType;
}

/**
 * A operation with two sides seperated by a operator.
 * Both sides can be ANY Complex Expression.
 */
export interface BinaryOperationNode extends ASTNode {
  type: "BinaryExpr";
  left: NumericLiteral;
  right: NumericLiteral;
  operator: string; // needs to be of type BinaryOperator
}

// LITERAL / PRIMARY EXPRESSION TYPES
/**
 * Represents a user-defined variable or symbol in source.
 */
export interface Identifier extends ASTNode {
  type: "Identifier";
  symbol: string;
}

/**
 * Represents a numeric constant inside the soure code.
 */
export interface NumericLiteral extends ASTNode {
  type: "NumericLiteral";
  value: number;
}

/**
 * Like Javascript defines a value of no meaning or undefined behavior.
 */
export interface NullLiteral extends ASTNode {
  type: "NullLiteral";
  value: "null";
}
