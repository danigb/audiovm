/**
 * Arithmetic and logic operations
 * @module alu
 */
import { load } from "../process";

// module that works with negative numbers
export const wrap = (a, b) => (a % b + b) % b;

// A generic operation that pops one value from stack and pushes one result
const op1 = fn => proc => {
  proc.stack.push(fn(proc.stack.pop()));
};

// A generic operation that pops two values from the stack and pushes one result
const op2 = fn => proc => {
  proc.stack.push(fn(proc.stack.pop(), proc.stack.pop()));
};

export default {
  /**
   * Add two values
   * @example
   * [1, 2, "@add"]
   */
  "@add": op2((b, a) => a + b),

  /**
   * Subtract two values
   * @example
   * [1, 0.5, "@sub"]
   */
  "@sub": op2((b, a) => a - b),

  /**
   * Multiply two values
   * 
   * @example
   * [2, 3, "@mul"]
   */
  "@mul": op2((b, a) => a * b),

  /**
   * Divide two values
   * [4, 2, "@div"]
   */
  "@div": op2((b, a) => (b === 0 ? 0 : a / b)),

  /**
   * Modulo for positive and negative numbers (Euclidean)
   * @see http://en.wikipedia.org/wiki/Modulo_operation 
   * @example
   * [4, -2, "@wrap"]
   */
  "@wrap": op2((b, a) => (b === 0 ? 0 : wrap(a, b))),

  /**
   * Standard module operation
   */
  "@mod": op2((b, a) => (b === 0 ? 0 : a % b)),

  /**
   * Negative of a value
   */
  "@neg": op1(a => -a),

  /**
   * Conditional execution
   * @param array trueBranch
   * @param array falseBranch
   * @param boolean condition
   * 
   * @example
   * [['@kick'], ['@snare'], true, '@cond']
   */
  "@cond": proc => {
    const cond = proc.stack.pop();
    const falseProgr = proc.stack.pop();
    const trueProgr = proc.stack.pop();
    if (cond) load(trueProgr, proc);
    else load(falseProgr, proc);
  },

  /** 
   * Greater than
   */
  "@>": op2((b, a) => a > b),

  /**
   *  Greater or equal than
   */
  "@>=": op2((b, a) => a >= b),

  /**
   * Less than
   */
  "@<": op2((b, a) => a < b),

  /**
   * Less or equal than
   */
  "@<=": op2((b, a) => a <= b),

  /**
   * Is equal
   */
  "@==": op2((b, a) => a === b),

  /**
   * Is not equal
   */
  "@!=": op2((b, a) => a !== b),

  /**
   * Logic not
   */
  "@not": op1(a => !a),

  /**
   * Logic and
   */
  "@and": op2((b, a) => a && b),

  /**
   * Logic or
   */
  "@or": op2((b, a) => a || b)
};
