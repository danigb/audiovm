import transpiler from "./transpiler";

const matches = regex => op =>
  typeof op === "string" ? regex.exec(op) : false;

// remove comments
const COMMENT = /^##/;
const comments = () => null;
comments.test = matches(COMMENT);

// reverse the direction of current array
const FORWARD = /^@>>\s*$/;
const forward = (output, op, index, input, transpile) => {
  if (index !== 0)
    throw Error("Forward operator must be the first of an array");
  const rev = input.slice(1).reverse();
  transpile(rev).forEach(op => output.push(op));
  input.length = 0;
};
forward.test = matches(FORWARD);

const FORWARD_INLINE = /^#@>>\s*$/;
const forwardInline = (output, op, index, input, transpile) => {
  const rev = op.slice(1).reverse();
  transpile(rev).forEach(op => output.push(op));
};
forwardInline.test = op =>
  Array.isArray(op) ? matches(FORWARD_INLINE)(op[0]) : false;

// split operator params
const OPERATOR = /^(@[^-]+)(-.*)$/;
const NUMERIC = /^[\d\.]+$/;
const params = (output, op, index, input, transpile, test) => {
  const value = test[2].slice(1);
  output.push(NUMERIC.test(value) ? +value : value);
  output.push(test[1]);
};
params.test = matches(OPERATOR);

export default transpiler([comments, forwardInline, forward, params]);
