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

  "@pause": proc => {},
  "@resume": proc => {},

  /**
   * Stop current process
   */
  "@stop": proc => {}
};
