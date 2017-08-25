const isArray = Array.isArray;

/**
 * The simplest transform function. It returns the same tree structure.
 * 
 * This jsdoc also documents the signature of any transform operation.
 * 
 * @private
 * @param {*} output 
 * @param {*} op 
 * @param {*} index 
 * @param {*} input 
 * @param {*} transpile 
 */
const recursiveBypass = (output, op, index, input, transpile) => {
  if (isArray(op)) output.push(transpile(op));
  else output.push(op);
  return output;
};

/**
 * Create a transform decorator the test the operation with the predicate
 * before running the actual transformation
 * 
 * @param {Function} test 
 * @param {Function} transform 
 * @return {Function} the decorated transform function
 */
export const when = predicate => transform => {
  return function(output, op, index, input, transpile) {
    const test = predicate(op, index, input);
    if (test) {
      transform(output, op, index, input, transpile, test);
      return output;
    }
  };
};

/**
 * Decorates a transform with a REGEX pattern test
 * @param {RegExp} regex 
 */
export const whenMatches = regex =>
  when(op => (typeof op === "string" ? regex.exec(op) : false));

/**
 * Decorates a tranform to test if an operation is included in an array
 * @param {Array} array 
 */
export const whenIn = array => when(op => array.includes(op));

/**
 * Combine a collection of transformers into a single one
 * 
 * @param {Array.Function} all 
 */
export const combine = all => (output, op, index, input, transpile) => {
  for (let i = 0; i < all.length; i++) {
    const result = all[i](output, op, index, input, transpile);
    if (result) return result;
  }
};

/**
 * Create a transpiler: a compiler of programs in array notation to programs in array notation
 * 
 * @param {Function} transform 
 * @param [Function] next - (Optional) the next transpiler in the chain
 */
export default function transpiler(transform, next) {
  if (!transform) transform = () => false;

  return function transpile(program) {
    if (!isArray(program)) return transpile([program])[0];

    const input = program.slice();
    const output = input.reduce((output, op, index, input) => {
      return (
        transform(output, op, index, input, transpile) ||
        recursiveBypass(output, op, index, input, transpile)
      );
    }, []);

    return next ? next(output) : output;
  };
}
