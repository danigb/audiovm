let nextId = 0;

/**
 * Creates a program with an instruction list
 * 
 * @param {array} instructions 
 * @param {function} onended 
 */
export const init = (instructions, onended) => ({
  id: "#" + nextId++,
  instructions,
  count: 0,
  procs: [],
  onended
});

/**
 * Stop a program
 * 
 * @param {program} program 
 */
export const stop = program => {
  console.log("stop program", program);
  program.procs.forEach(proc => {
    if (proc) proc.operations.length = 0;
  });
  program.onended(program);
};

/**
 * Add a process to a program
 * 
 * @param {process} proc 
 * @param {program} program 
 */
export const addProcess = (proc, program) => {
  proc.pid = program.length;
  program.procs.push(proc);
  program.count++;
  return program;
};

/**
 * Detach a process from it's program
 * @param {process} proc 
 */
export const removeProcess = (proc, program) => {
  if (program.procs[proc.pid] === proc) {
    program.procs[proc.pid] = null;
    program.count--;
    if (program.count === 0) program.onended(program);
    proc.pid = null;
  }
  return proc;
};
