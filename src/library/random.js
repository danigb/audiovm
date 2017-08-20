/**
 * Random operations
 * @module random
 */

const floor = Math.floor;
// generates a float between [0, 1)
const rnd = Math.random;
// a function that generates integer random in range [0,n)
const irnd = n => floor(rnd() * n);

export default {
  /**
   * Generate a random number between 0 and 1
   * @function
   * @example
   * ['@rand', '@kick:set-amp']
   */
  "@rand": proc => {
    proc.stack.push(rnd());
  },

  /**
   * Picks a random element from an array
   * @param {array} array
   * @function
   * @example
   * [['one', 'two', 'three'], '@pick', '@log']
   */
  "@pick": proc => {
    const arr = proc.stack[proc.stack.length - 1];
    proc.stack.push(arr[irnd(arr.length)]);
  }
};
