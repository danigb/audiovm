import { load } from "../process";
import { stop } from "../program";
/**
 * Process operations
 * @module process
 */

export default {
  /**
   * Evaluate the program from the stack
   * @param {array} program
   * 
   * @example
   * [['minor', 'C3', 8, '@scale', '@let-Scale'], '@eval', '@get-Scale']
   */
  "@eval": proc => {
    const program = proc.stack.pop();
    load(program, proc);
  },
  /**
   * Invoke a function
   * @param [string] name - the function name
   * 
   * @example
   * ['pluck', '@call']
   */
  "@call": proc => {
    const name = proc.stack.pop();
    proc.run(["@" + name]);
  },

  /**
   * Get the next element from the stack and log it
   * @example
   * [60, '@mtof', '@log']
   */
  "@log": proc => {
    const value = proc.stack.pop();
    console.log(proc.time, value);
  },

  /**
   * Duplicate the next value of the stack
   * @example
   * ['Hi', '@dup', '@log', '@log'] 
   */
  "@dup": proc => {
    const value = proc.stack[proc.stack.length - 1];
    proc.stack.push(value);
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
   * Stop another process
   * @param [string] the id of the process
   */
  "@kill": (proc, vm) => {
    const id = proc.stack.pop();
    const program = vm.scope[id];
    stop(program);
  }
};
