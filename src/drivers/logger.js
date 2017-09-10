const toStr = o => (o ? (Array.isArray(o) ? "[" + o + "] " : o + " ") : "");
const peek = (arr, n = 0) => arr[arr.length - 1 - n];

const withLog = (name, op) => (proc, env) => {
  const time = proc.time.toFixed(2);
  const next = toStr(peek(proc.stack));
  const next2 = toStr(peek(proc.stack));
  console.log(time + " %c" + name, "background: #444; color: white;");
  console.log(next2 + next + "" + name);
  op(proc, env);
  console.log(toStr(peek(proc.stack)));
};

/**
 * Add logging to the operations
 */
export default vm => {
  const scope = vm.scope;
  const keys = Object.keys(scope);
  keys.forEach(key => {
    if (typeof key === "string" && key[0] === "@") {
      scope[key] = withLog(key, scope[key]);
    }
  });
  return vm;
};
