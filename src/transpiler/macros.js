import transpiler, { combine, whenMatches } from "./transpiler";

// remove comments
const COMMENT = /^##/;
const comments = whenMatches(COMMENT)(() => null);

// reverse the direction of current array
const FORWARD = /^>>(@.+)$/;
const forward = whenMatches(FORWARD)((output, op, index, input, tr, test) => {
  if (index !== 0)
    throw Error("Forward operator must be the first of an array");
  const rev = input.slice(1).reverse();
  rev.push(test[1]);
  tr(rev).forEach(op => output.push(op));
  input.length = 0;
});

// split operator params
const OPERATOR = /^(@[^-]+)(-.*)$/;
const NUMERIC = /^[\d\.]+$/;
const params = whenMatches(OPERATOR)((output, op, i, input, tr, test) => {
  const value = test[2].slice(1);
  output.push(NUMERIC.test(value) ? +value : value);
  output.push(test[1]);
});

const transform = combine([comments, forward, params]);
export default transpiler(transform);
