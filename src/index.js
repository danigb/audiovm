let nextId = 1;

/**
 * Create a process
 * @return {Process} 
 */
export function process(props) {
  const proc = {
    id: nextId++,
    time: 0,
    context: {},
    stack: [],
    operations: []
  };
  Object.assign(proc, props);

  proc.exec = (lib = {}, maxTime = Infinity, maxOps = 1000) => {
    while (proc.time < maxTime && --maxOps && proc.operations.length) {
      const op = proc.operations.pop();
      if (typeof op === "function") op(proc, lib);
      else if (typeof op === 'string' && op[0] === '@') proc.call(lib, op);
      else proc.stack.push(op);
    }
    return proc;
  };

  proc.load = program => {
    let i = program.length;
    while (i--) {
      proc.operations.push(program[i]);
    }
    return proc;
  };

  proc.call = (lib, name) => {
    const fn = lib[name];
    if (typeof fn === "function") {
      fn(proc, lib);
    } else {
      console.warn(name + " is not a function.");
    }
  };

  return proc;
}


/**
 * A reference clock. A clock is a function that accepts a callback
 * and call the callback at a given interval
 * 
 * @param {Number} interval - the interval of the clock in seconds
 * @return {Function} 
 */
export const clock = (interval = 0.1) =>
  resume => {
    const id = setInterval(() => resume(interval), interval * 1000);
    return () => clearInterval(id);
  };

/**
 * Create a scheduler
 * 
 * @param {Object} library - the library
 * @param {Function} clock 
 */
export function scheduler(baseLib = {}, start = clock()) {
  let time = 0;
  const queue = [];

  // add scheduling functions to library
  const lib = Object.assign(baseLib, {});

  // insert a process in a priority queue
  function schedule(proc) {
    let i = queue.length - 1;
    while (i >= 0 && queue[i].time < proc.time) {
      i--;
    }
    queue.splice(i + 1, 0, proc);
    return proc;
  }

  // resume process for a duration (expressed in seconds)
  start((duration, limit = 1000) => {
    const endsAt = time + duration;
    let proc = queue.pop();
    while (proc && proc.time < endsAt && limit--) {
      proc.exec(lib, endsAt);
      if (proc.operations.length) schedule(proc);
      proc = queue.pop();
    }
    if (proc) queue.push(proc);
    time = endsAt;
  });

  // API: return a function to run programs
  function run(program, delay) {
    return schedule(process({ time }).load(program));
  }
  run.lib = lib;
  return run;
}

const OPERATOR = /^(@[^-]+)(-.*)$/;
export function compiler() {
  return function compile(program) {
    let m;
    return program.reduce(
      (compiled, op) => {
        if (Array.isArray(op)) {
          compiled.push(compile(op));
        } else if ((m = OPERATOR.exec(op))) {
          compiled.push(m[2].slice(1));
          compiled.push(m[1]);
        } else {
          compiled.push(op);
        }
        return compiled;
      },
      []
    );
  };
}
