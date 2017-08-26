let nextId = 1;

/**
 * Create a lightweight process
 * 
 * @private
 * @param {Object} props
 * @return {Process} 
 */
export function process(parent = null, time = 0, context = {}) {
  const proc = {
    id: "" + nextId++,
    parent,
    time,
    context,
    stack: []
  };
  const operations = [];

  const noop = name => () => console.warning(name + " is not in library");
  const call = (env, name) => (env.lib[name] || noop(name))(proc, env);

  proc.exec = (env, maxTime = Infinity, maxOps = 1000) => {
    while (proc.time < maxTime && --maxOps && operations.length) {
      const op = operations.pop();
      if (typeof op === "function") op(proc, env);
      else if (typeof op === "string" && op[0] === "@") call(env, op);
      else proc.stack.push(op);
    }
    if (!maxOps) throw Error(`[proc:${proc.id} - Loop limit reached`);
    return operations.length;
  };

  proc.stop = () => (operations.length = 0);

  proc.load = program => {
    let i = program.length;
    while (i--) {
      operations.push(program[i]);
    }
    return proc;
  };

  return proc;
}

/**
 * A reference clock. A clock is a function that accepts a callback
 * and call the callback at a given interval
 * 
 * This clock is not to be used with music (Gibberish and Web Audio
 * API provides better timing options) but as a reference on how
 * to implement a clock and to perform tests.
 * 
 * @private
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
 * @private
 * @param {Object} env - the environment
 * @param {Function} clock 
 */
export function scheduler(env = {}, start = clock()) {
  const queue = [];
  let running = false;

  function schedule(proc) {
    let i = queue.length - 1;
    while (i >= 0 && queue[i].time < proc.time) {
      i--;
    }
    queue.splice(i + 1, 0, proc);
    if (!running) {
      //env.bus("start", proc)
      running = true;
    }
    return proc;
  }
  env.schedule = schedule;

  schedule.time = 0;
  schedule.env = env;
  schedule.fork = (parent, program) => {
    return schedule(process(parent, schedule.time)).load(program);
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
      if (proc.exec(env, endsAt)) schedule(proc);
      proc = queue.pop();
    }
    if (proc) queue.push(proc);
    schedule.time = endsAt;
  });

  return schedule;
}

/**
 * Create a Virtual Machine
 * 
 * @private
 * @param {Object} env - the enviroment
 * @param {Function} clock - the clock function
 * @param [Function] transpile - an optional transpile function
 * @return {VM} the vm object
 */
export default function vm(env, clock) {
  const schedule = scheduler(env, clock);

  return {
    env,
    schedule,
    /**
     * Run a program
     * @function
     * @name run
     * @memberof vm
     * @param {array} program - the program to run
     */
    run: (program, sync = true) => {
      if (sync) {
        if (schedule.count()) program.unshift("@sync");
        else schedule.time = Math.floor(schedule.time + 1);
      }
      return schedule.fork(null, program);
    }
  };
}
