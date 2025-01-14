import Parser from "./src/modules/parser.ts";
import { evaluateASTNode } from "./src/runtime/interpreter.ts";

startArithmeticREPL();

function startArithmeticREPL() {
  const parser = new Parser();
  console.log("\n Arithmetic Operation v0.1");

  // Continue REPL until user stops or types 'exit'
  while (true) {
    const input = prompt("> ");

    // Check for empty input or exact 'exit' command to quit
    if (!input || input.trim().toLowerCase() === "exit") {
      console.log("Exiting Arithmetic Operations...");
      Deno.exit(0);
    }

    try {
      const ast = parser.produceAST(input); // Parsing the input to AST
      console.log("AST:", JSON.stringify(ast, null, 2)); // Show AST for debugging- debug log
      const result = evaluateASTNode(ast); // Evaluate the AST
      console.log("Result:", result); // Output the result of the evaluation
    } catch (error) {
      console.error("Error during parsing or evaluation:", error); // More detailed error message
    }
  }
}
