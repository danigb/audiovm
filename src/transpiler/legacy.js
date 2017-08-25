import transpiler, { when, whenIn, whenMatches, combine } from "./transpiler";

const TO_REMOVE = "REMOVE";

const remove = (array, index) => {
  const value = array[index];
  array[index] = TO_REMOVE;
  return value;
};

const REPLACEMENTS = {
  "@+": "@add",
  "@-": "@sub",
  "@*": "@mul",
  "@/": "@div",
  "@%": "@wrap",
  "@!": "@not",
  "@&&": "@and",
  "@||": "@or",
  "@map": "@scale-lin",
  "@note": "@midi:note",
  "@note-on": "@midi:noteon",
  "@note-off": "@midi:noteoff",
  "@cc": "@midi:cc"
};
const REPLACES = Object.keys(REPLACEMENTS);

const replacements = whenIn(REPLACES)((output, op) =>
  output.push(REPLACEMENTS[op])
);

const FREQ_AMP_NOTE_OPS = /^@(pluck)-note$/;
const freqAmpNote = whenMatches(
  FREQ_AMP_NOTE_OPS
)((output, op, i, input, tr, test) => {
  const name = test[1];
  output.push(`@${name}:set-freq`);
  output.push(`@${name}:set-amp`);
  output.push(`@${name}`);
});

const LEFT_AND_RIGHT_OPS = ["@repeat", "@spawn"];
const leftAndRightSide = whenIn(
  LEFT_AND_RIGHT_OPS
)((output, op, index, input, transpile) => {
  const left = remove(output, output.length - 1);
  const right = remove(input, index + 1);
  output.push(transpile(right));
  output.push(left);
  output.push(op);
});

const RIGHT_SIDE_OPS = ["@loop", "@iter", "@fork", "@pick"];
const rightSide = whenIn(
  RIGHT_SIDE_OPS
)((output, op, index, input, transpile) => {
  const next = input[index + 1];
  input[index + 1] = TO_REMOVE;
  output.push(transpile(next));
  output.push(op);
});

const CONDITIONAL_OPS = ["@chance", "@cond"];
const conditionals = whenIn(
  CONDITIONAL_OPS
)((output, op, index, input, transpile) => {
  const left = remove(output, output.length - 1);
  const trueBranch = remove(input, index + 1);
  const falseBranch = remove(input, index + 2);
  output.push(transpile(trueBranch));
  output.push(transpile(falseBranch));
  output.push(transpile(left));
  output.push(op);
});

const unnecessaryArrays = when(
  Array.isArray
)((output, op, index, input, transpile) =>
  transpile(op).forEach(o => output.push(o))
);

const transform = combine([
  replacements,
  freqAmpNote,
  conditionals,
  leftAndRightSide,
  rightSide,
  unnecessaryArrays
]);

const clean = output => output.filter(op => op !== TO_REMOVE);

export default transpiler(transform, clean);
