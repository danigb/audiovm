/**
 * Process operations
 * @module process
 */

export default {
  /**
   * __@wait__: wait
   * @param [number] delay - the time to wait in beats
   * 
   * @example
   * [0.5, '@wait']
   */
  "@wait": proc => {
    const delay = proc.stack.pop();
    proc.time += delay;
  },

  /**
   * Wait until next beat
   * 
   * @example
   * ['@sync', '@kick']
   */
  "@sync": proc => {
    const delay = Math.floor(proc.time) + 1 - proc.time;
    if (delay < 0.99) proc.time = Math.floor(proc.time + 1);
  },

  /**
   * Set the id of this process
   * @param [string] the id of this process
   */
  "@id": proc => {
    const id = proc.stack.pop();
    proc.id = id;
  },

  /**
   * Stop current process
   */
  "@exit": proc => {
    proc.operations.length = 0;
  },

  /**
   * Repeat a number of times
   * @param [array] the program to repeat
   * @param [number] the number of times
   */
  "@repeat": proc => {
    const times = proc.stack.pop();
    const program = proc.stack.pop();
    if (times > 1) {
      proc.load([program, times - 1, "@repeat"]);
    }
    proc.load(program);
  },

  /**
   * Repeat a program forever
   * @param [array] the program to repeat forever
   * @example
   * [[1, '@wait', '@pluck'], '@forever']
   */
  "@forever": proc => {
    const program = proc.stack.pop();
    proc.load([program, "@forever"]);
    proc.load(program);
  },

  /**
   * Start a new child process
   */
  "@fork": (proc, env) => {
    if (env.schedule) {
      const program = proc.stack.pop();
      env.schedule.fork(proc, program);
    }
  },

  /**
   * Fork (or replace) a loop with a name 
   * @param [array] program
   * @param [string] name
   * @example
   * [['@kick', '@wait-1'], 'kick', '@spawn']
   */
  "@spawn": (proc, env) => {
    if (env.schedule) {
      const id = proc.stack.pop();
      env.schedule.remove(id);
      const program = proc.stack.pop();
      env.schedule.fork(proc, [id, "@id", program, "@forever"]);
    }
  },

  /**
   * Start a new child process that repeats forever
   */
  "@loop": (proc, env) => {
    if (env.schedule) {
      const program = proc.stack.pop();
      env.schedule.fork(proc, [program, "@forever"]);
    }
  },

  /**
   * Stop all processes
   * 
   */
  "@stop:all": (proc, env) => {
    if (env.schedule) {
      env.schedule.removeAll();
    }
  },

  /**
   * Stop another process
   * @param [string] the id of the process
   */
  "@stop": (proc, env) => {
    if (env.schedule) {
      const id = proc.stack.pop();
      env.schedule.remove(id);
    }
  },
  "@pause": proc => {},
  "@resume": proc => {}
};
