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
function replacements(result, op) {
  if (REPLACES.includes(op)) {
    result.push(REPLACEMENTS[op]);
    return true;
  } else {
    return false;
  }
}

const FREQ_AMP_NOTE_OPS = /^@(pluck)-note$/;
function freqAmpNote(result, op) {
  const m = FREQ_AMP_NOTE_OPS.exec(op);
  if (m) {
    const name = m[1];
    result.push(`@${name}:set-freq`);
    result.push(`@${name}:set-amp`);
    result.push(`@${name}`);
    return true;
  } else {
    return false;
  }
}

const LEFT_AND_RIGHT_OPS = ["@repeat", "@spawn"];
function leftAndRightSide(result, op, index, source) {
  if (LEFT_AND_RIGHT_OPS.includes(op)) {
    const left = remove(result, result.length - 1);
    const right = remove(source, index + 1);
    result.push(transpile(right));
    result.push(left);
    result.push(op);
    return true;
  } else {
    return false;
  }
}

const RIGHT_SIDE_OPS = ["@loop", "@iter", "@fork", "@pick"];
function rightSide(result, op, index, source) {
  if (RIGHT_SIDE_OPS.includes(op)) {
    const next = source[index + 1];
    source[index + 1] = TO_REMOVE;
    result.push(transpile(next));
    result.push(op);
    return true;
  } else {
    return false;
  }
}

const CONDITIONAL_OPS = ["@chance", "@cond"];
function conditionals(result, op, index, source) {
  if (CONDITIONAL_OPS.includes(op)) {
    const left = remove(result, result.length - 1);
    const trueBranch = remove(source, index + 1);
    const falseBranch = remove(source, index + 2);
    result.push(transpile(trueBranch));
    result.push(transpile(falseBranch));
    result.push(transpile(left));
    result.push(op);
    return true;
  } else {
    return false;
  }
}

function unnecessaryArrays(result, op) {
  if (Array.isArray(op)) {
    transpile(op).forEach(o => result.push(o));
    return true;
  } else {
    return false;
  }
}

function bypass(result, op) {
  if (op !== TO_REMOVE) result.push(op);
  return true;
}

const RULES = [
  replacements,
  freqAmpNote,
  conditionals,
  leftAndRightSide,
  rightSide,
  unnecessaryArrays,
  bypass
];

export default function transpile(source) {
  if (!Array.isArray(source)) {
    return transpile([source])[0];
  } else {
    return source
      .reduce((result, op, index, source) => {
        for (let i = 0; i < RULES.length; i++) {
          if (RULES[i](result, op, index, source)) {
            return result;
          }
        }
      }, [])
      .filter(op => op !== TO_REMOVE);
  }
}
