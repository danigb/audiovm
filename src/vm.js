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

  proc.exec = (env, maxTime = Infinity, maxOps = 1000) => {
    while (proc.time < maxTime && --maxOps && proc.operations.length) {
      const op = proc.operations.pop();
      if (typeof op === "function") op(proc, env);
      else if (typeof op === "string" && op[0] === "@") proc.call(env, op);
      else proc.stack.push(op);
    }
    if (!maxOps) throw Error(`[proc:${proc.id} - Loop limit reached`);
    return proc;
  };

  proc.load = program => {
    let i = program.length;
    while (i--) {
      proc.operations.push(program[i]);
    }
    return proc;
  };

  proc.call = (env, name) => {
    const fn = env.lib[name];
    if (typeof fn === "function") {
      fn(proc, env);
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
export const clock = (interval = 0.1) => resume => {
  const id = setInterval(() => resume(interval), interval * 1000);
  return () => clearInterval(id);
};

/**
 * Create a scheduler
 * 
 * @param {Object} library - the library
 * @param {Function} clock 
 */
export function scheduler(env = {}, start = clock()) {
  const queue = [];

  function schedule(proc) {
    let i = queue.length - 1;
    while (i >= 0 && queue[i].time < proc.time) {
      i--;
    }
    queue.splice(i + 1, 0, proc);
    return proc;
  }
  schedule.time = 0;
  schedule.env = Object.assign({ schedule }, env);
  schedule.fork = (parent, program) => {
    return schedule(process({ parent, time: schedule.time }).load(program));
  };
  schedule.count = () => queue.length;
  schedule.processes = () => queue.slice();
  schedule.find = id => queue.find(p => p.id === id);
  schedule.remove = id => {
    for (let i = 0; i < queue.length; i++) {
      if (queue[i].id === id) {
        queue.splice(i, 1);
        return true;
      }
    }
    return false;
  };
  schedule.removeAll = () => (queue.length = 0);

  // resume process for a duration (expressed in seconds)
  start((duration, limit = 1000) => {
    const endsAt = schedule.time + duration;
    let proc = queue.pop();
    while (proc && proc.time < endsAt && limit--) {
      proc.exec(schedule.env, endsAt);
      if (proc.operations.length) schedule(proc);
      proc = queue.pop();
    }
    if (proc) queue.push(proc);
    schedule.time = endsAt;
  });

  return schedule;
}

const OPERATOR = /^(@[^-]+)(-.*)$/;
export function compiler() {
  return function compile(program) {
    let m;
    return program.reduce((compiled, op) => {
      if (Array.isArray(op)) {
        compiled.push(compile(op));
      } else if ((m = OPERATOR.exec(op))) {
        compiled.push(m[2].slice(1));
        compiled.push(m[1]);
      } else {
        compiled.push(op);
      }
      return compiled;
    }, []);
  };
}

/**
 * Create a Virtual Machine
 * 
 * @param {Object} env - the enviroment
 * @param {Function} clock - the clock function
 * @return {Function} a `run` function
 */
export default function vm(env, clock) {
  const schedule = scheduler(env, clock);
  const compile = compiler();

  return function run(program, sync = true) {
    const compiled = compile(program);
    if (sync) {
      if (schedule.count()) compiled.unshift("@sync");
      else schedule.time = Math.floor(schedule.time + 1);
    }
    return schedule.fork(null, compiled);
  };
}
