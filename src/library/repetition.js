/**
 * Repetition
 * @module repetition
 */
import { load } from "../process";
import { spawn } from "../vm";

export default {
  "@loop": (proc, vm) => {
    const instructions = proc.stack.pop();
    spawn([instructions, "@forever"], vm);
  },
  /**
   * Repeat something a number of times
   * @param [array] the program to repeat
   * @param [number] the number of times
   */
  "@repeat": proc => {
    const times = proc.stack.pop();
    const program = proc.stack.pop();
    if (times > 1) {
      load([program, times - 1, "@repeat"], proc);
    }
    load(program, proc);
  },

  /**
   * Repeat a program forever
   * @param [array] the program to repeat forever
   * @example
   * [[1, '@wait', '@pluck'], '@forever']
   */
  "@forever": proc => {
    const program = proc.stack.pop();
    load([program, "@forever"], proc);
    load(program, proc);
  },

  /**
   * @example
   * [':Pluck', [60, 61, 62], ['@mtof', '@set-freq', '@@note'], @each]   
   */
  "@each": proc => {
    const fn = proc.stack.pop();
    const array = proc.stack[proc.stack.length - 1];
    if (array.length) {
      const next = array.shift();
      load([next, fn, "@eval", fn, "@each"], proc);
    }
  }
};
