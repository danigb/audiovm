const TO_REMOVE = "REMOVE";

const consume = (array, index) => {
  const value = array[index];
  array[index] = TO_REMOVE;
  return value;
};

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
    const left = consume(result, result.length - 1);
    const right = consume(source, index + 1);
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
    const left = consume(result, result.length - 1);
    const trueBranch = consume(source, index + 1);
    const falseBranch = consume(source, index + 2);
    result.push(transpile(trueBranch));
    result.push(transpile(falseBranch));
    result.push(transpile(left));
    result.push(op);
    return true;
  } else {
    return false;
  }
}

function nestedArrays(result, op, index) {
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
  freqAmpNote,
  conditionals,
  leftAndRightSide,
  rightSide,
  nestedArrays,
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
