export type ValueType = "null" | "number" | "boolean";

export interface RuntimeVal {
  type: ValueType;
}

/**
 * Defines a value of undefined meaning
 */
export interface NullVal extends RuntimeVal {
  type: "null";
  value: "null";
}

/**
 * Runtime value that has access to the raw native javascript number.
 */
export interface NumberVal extends RuntimeVal {
  type: "number";
  value: number;
}

/**
 * Runtime value that represents a boolean.
 */
export interface BoolVal extends RuntimeVal {
  type: "boolean";
  value: boolean;
}
