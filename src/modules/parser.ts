// deno-lint-ignore-file no-explicit-any

import {
  ASTNode,
  BinaryOperationNode,
  Identifier,
  NullLiteral,
  NumericLiteral,
} from "./ast.ts";

import { Token, tokenize, TokenType } from "./lexer.ts";

/**
 * Frontend for producing a valid AST from sourcecode
 *
 *   // Orders of Precedence
 *   // ComparisonExpr
 *   // AdditiveExpr
 *   // MultiplicativeExpr
 *   // PrimaryExpr
 */
export default class Parser {
  private tokens: Token[] = [];

  /*
   * Determines if the parsing is complete and the END OF FILE Is reached.
   */
  private notEOF(): boolean {
    return this.tokens[0].type != TokenType.EOF;
  }

  /**
   * Returns the currently available token
   */
  private first() {
    return this.tokens[0] as Token;
  }

  /**
   * Returns the previous token and then advances the tokens array to the next value.
   */
  private shift() {
    return this.tokens.shift() as Token;
  }

  /**
   * Returns the previous token and then advances the tokens array to the next value.
   *  Also checks the type of expected token and throws if the values do not match.
   */
  private hasCloseParenthesis() {
    const prev = this.shift();
    if (!prev || prev.type != TokenType.CloseParen) {
      console.error(
        "Unexpected token found inside parenthesised expression. Expected closing parenthesis.",
      );
      Deno.exit(1);
    }

    return prev;
  }

  public produceAST(sourceCode: string): ASTNode {
    this.tokens = tokenize(sourceCode);

    return this.parseStatement();
  }

  private parseStatement(): ASTNode {
    let left = this.parseAdditiveExpression(); // Handles addition/subtraction (higher precedence than comparison)

    while (
      this.first().value == "<" || this.first().value == ">" ||
      this.first().value == "<=" || this.first().value == ">=" ||
      this.first().value == "==" || this.first().value == "!="
    ) {
      const operator = this.shift().value; // Get the operator
      const right = this.parseAdditiveExpression(); // Parse the right-hand side expression
      left = {
        type: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryOperationNode;
    }

    return left;
  }

  // Handle Addition & Subtraction Operations
  private parseAdditiveExpression(): ASTNode {
    let left = this.parseMultiplicativeExpression();

    while (this.first().value == "+" || this.first().value == "-") {
      const operator = this.shift().value;
      const right = this.parseMultiplicativeExpression();
      left = {
        type: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryOperationNode;
    }

    return left;
  }

  // Handle Multiplication, Division & Modulo Operations
  private parseMultiplicativeExpression(): ASTNode {
    let left = this.parsePrimaryExpression();

    while (
      this.first().value == "/" || this.first().value == "*" ||
      this.first().value == "%"
    ) {
      const operator = this.shift().value;
      const right = this.parsePrimaryExpression();
      left = {
        type: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryOperationNode;
    }

    return left;
  }

  // Parse Literal Values & Grouping Expressions
  private parsePrimaryExpression(): ASTNode {
    const tokenType = this.first().type;

    // Determine which token we are currently first and return literal value
    switch (tokenType) {
      // User defined values.
      case TokenType.Identifier:
        return { type: "Identifier", symbol: this.shift().value } as Identifier;

      case TokenType.Null:
        this.shift(); // advance past null keyword
        return { type: "NullLiteral", value: "null" } as NullLiteral;

      // Constants and Numeric Constants
      case TokenType.Number:
        return {
          type: "NumericLiteral",
          value: parseFloat(this.shift().value),
        } as NumericLiteral;

      // Grouping Expressions
      case TokenType.OpenParen: {
        this.shift(); // shift the opening paren
        const value = this.parseStatement();

        this.hasCloseParenthesis();
        return value;
      }

      // Unidentified Tokens and Invalid Code Reached
      default:
        console.error("Unexpected token found during parsing!", this.first());
        Deno.exit(1);
    }
  }
}
