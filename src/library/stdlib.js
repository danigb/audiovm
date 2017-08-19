export default {
  /**
   * Log next element from the stack
   */
  "@log": proc => {
    const value = proc.stack.pop();
    console.log(proc.time, value);
  },

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
   * __@call__: invoke a function
   * @param [string] name - the function name
   * 
   * @example
   * ['pluck', '@call']
   */
  "@call": (proc, lib) => {
    const name = proc.stack.pop();
    proc.call(lib, "@" + name);
  },

  /**
   * __@defn__: define a function
   * @param [array] function body
   * @param [string] name of the function
   * 
   * @example
   * [[440, '@set-freq', '@pluck'], 'pluck-A4', '@defn']
   */
  "@defn": (proc, lib) => {
    const name = "@" + proc.stack.pop();
    const program = proc.stack.pop();
    lib[name] = proc => proc.load(program);
  },

  /**
   * Sets a value in the local context
   * @example
   * [440, 'freq', '@let']
   */
  "@let": proc => {
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
  "@get": proc => {
    const key = proc.stack.pop();
    let current = proc;
    while (current.context[key] === undefined && current.parent) {
      current = current.parent;
    }
    proc.stack.push(current.context[key]);
  },

  /**
   * Set a value into the context
   * @example
   * [440, 'freq', '@set']
   */
  "@set": proc => {
    const key = proc.stack.pop();
    const value = proc.stack.pop();
    let current = proc;
    while (current.context[key] === undefined && current.parent) {
      current = current.parent;
    }
    current.context[key] = value;
  }
};