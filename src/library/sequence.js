/**
 * Sequence operations
 * @module sequence
 */

export default {
  /**
 * @example
 * [':Pluck', [60, 61, 62], ['@mtof', '@set-freq', '@@note'], @each]   
 */
  "@each": proc => {
    const fn = proc.stack.pop();
    const array = proc.stack[proc.stack.length - 1];
    if (array.length) {
      const next = array.shift();
      proc.load([next, ...fn, fn, "@each"]);
    }
  }
};
