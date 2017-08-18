
let nextId = 1;

/**
 * Create a process
 * 
 * @param {Array} program 
 * @param {Number} time 
 * @param {Process} parent 
 * @return {Process} 
 */
export function process(program = [], time = 0, parent = null) {
  const proc = (lib, maxTime = Infinity, maxOps = 1000) => {
    const ops = proc.operations;
    while (proc.time < maxTime && maxOps && ops.length) {
      const op = ops.pop();
      if (typeof op === "function") op(proc, lib);
      else proc.stack.push(op);
    }
    return proc;
  };

  proc.id = nextId++;
  proc.time = time;
  proc.parent = parent;
  proc.stack = [];
  proc.context = null;
  proc.operations = program.slice().reverse();

  return proc;
}

// PRIVATE: invoke a function from a library
function invoke (name, proc, lib) {
  const fn = lib[name];
  if (typeof fn === 'function') {
    fn(proc, lib);
  } else {
    console.warn(name + ' is not a function.');
  }
}

export const lib = {
  wait: (proc) => {
    const delay = proc.stack.pop();
    proc.time += delay;
  },
  call: (proc, lib) => {
    invoke(proc.stack.pop(), proc, lib);
  }
}

/**
 * A reference clock. A clock is a function that accepts a callback
 * and call the callback at a given interval
 * 
 * @param {Number} interval - the interval of the clock in seconds
 * @return {Function} 
 */
export const jsclock = (interval = 0.1) => (resume) => {
  const id = setInterval(() => resume(interval), interval * 1000)
  return () => clearInterval(id);
}

/**
 * Create a scheduler
 * 
 * @param {Object} library - the library
 * @param {Function} clock 
 */
export function scheduler (baseLib = {}, clock = jsclock()) {
  let time = 0;
  const queue = [];

  const lib = Object.assign(baseLib, {

  });

  function schedule (proc) {
    let i = queue.length - 1;
    while (i >= 0 && queue[i].time < proc.time) {
      i--;
    }
    queue.splice(i + 1, 0, proc);
    return proc
  }

  function resume (duration, limit = 1000) {
    const endsAt = time + duration;
    let proc = queue.pop();
    while(proc && proc.time < endsAt && limit--) {
      proc(lib, endsAt);
      if (proc.operations.length) schedule(proc);
      proc = queue.pop();
    }
    if (proc) queue.push(proc);
    time = endsAt;
  }

  const run = (program) => schedule(process(program, time));
  run.stop = clock(resume);
  run.lib = lib
  return run;
}

export function compiler () {

  return function compile () {

  }
}