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

export const lib = {
  /**
   * @wait
   * 
   * @example
   * [0.5, '@wait']
   */
  wait: proc => {
    const delay = proc.stack.pop();
    proc.time += delay;
  },

  /**
   * @call: pop a name of a function from the stack and invoke it
   * 
   * @example
   * ['pluck', '@call']
   */
  call: (proc, lib) => {
    const name = proc.stack.pop();
    proc.call(lib, name);
  },

  /**
   * __@defn__: define a function
   * @param [array] function body
   * @param [string] name of the function
   * 
   * @example
   * [[440, '@set-freq', '@pluck'], 'pluck-A4', '@defn']
   */
  defn: (proc, lib) => {
    const name = proc.stack.pop();
    const program = proc.stack.pop();
    lib[name] = proc => proc.load(program);
  },

  /**
   * @let
   */
  let: proc => {
    const key = proc.stack.pop();
    const value = proc.stack.pop();
    if (!proc.context) proc.context = {};
    proc.context[key] = value;
  },

  /**
   * @get: get a value from context and push into the stack
   * @param [key] the key of the context value
   * 
   * @example
   * ['freq', '@get']
   */
  get: proc => {
    const key = proc.stack.pop();
    let current = proc;
    while (current.context[key] === undefined && current.parent) {
      current = current.parent;
    }
    proc.stack.push(current.context[key]);
  },

  set: proc => {
    const key = proc.stack.pop();
    const value = proc.stack.pop();
    let current = proc;
    while (current.context[key] === undefined && current.parent) {
      current = current.parent;
    }
    current.context[key] = value;
  }
};

/**
 * A reference clock. A clock is a function that accepts a callback
 * and call the callback at a given interval
 * 
 * @param {Number} interval - the interval of the clock in seconds
 * @return {Function} 
 */
export const jsclock = (interval = 0.1) =>
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
export function scheduler(baseLib = {}, clock = jsclock()) {
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
  function resume(duration, limit = 1000) {
    const endsAt = time + duration;
    let proc = queue.pop();
    while (proc && proc.time < endsAt && limit--) {
      proc.exec(lib, endsAt);
      if (proc.operations.length) schedule(proc);
      proc = queue.pop();
    }
    if (proc) queue.push(proc);
    time = endsAt;
  }

  // API: return a function to run programs
  function run(program, delay) {
    return schedule(process({ time }).load(program));
  }
  run.stop = clock(resume);
  run.lib = lib;
  return run;
}

export function compiler() {
  return function compile() {};
}
