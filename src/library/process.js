/**
 * Process operations
 * @module process
 */

export default {
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
