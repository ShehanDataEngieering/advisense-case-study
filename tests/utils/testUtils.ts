// Utility function to capture `console.error` output
export function captureConsoleError(fn: () => void): string {
  const originalConsoleError = console.error;
  let output = "";
  console.error = (msg: string) => {
    output += msg + "\n";
  };

  try {
    fn();
  } finally {
    console.error = originalConsoleError; // Restore original console.error
  }

  return output.trim();
}

// Mock console.error to capture the error message
export const mockConsoleError = (message: string) => {
  throw new Error(message);
};
