const warn = name => () => console.warn(name + " is not in library");

/**
 * Create a process from a parent
 */
export const createProcess = parent => ({
  parent,
  context: parent.context,
  time: parent.time,
  speed: parent.speed,
  operations: [],
  stack: []
});

/**
 * Create a process 
 * 
 * @param {array} instructions 
 * @param [process] parent 
 * @return {process}
 */
export const fork = (instructions, parent) =>
  load(instructions, createProcess(parent || { time: 0, speed: 1 }));

/**
 * Load instructions into a process
 * 
 * @param {Array} instructions
 * @param {process} proc 
 * @return {process}
 */
export const load = (instructions, proc) => {
  let i = instructions.length;
  while (i--) proc.operations.push(instructions[i]);
  return proc;
};

/**
 * Execute a process until given time
 * @param {process} proc 
 * @param {object} global 
 * @param {number} maxTime 
 */
export const exec = (time, proc, global) => {
  let maxOps = 1000;
  const ops = proc.operations;
  while (proc.time < time && --maxOps && ops.length) {
    const op = ops.pop();
    if (typeof op === "function") {
      op(proc, global);
    } else if (typeof op === "string" && op[0] === "@") {
      (global.scope[op] || warn(op))(proc, global);
    } else {
      proc.stack.push(op);
    }
  }
  if (!maxOps) throw Error(`[proc:${proc.id} - Loop limit reached`);
  return ops.length;
};
