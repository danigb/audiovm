/**
 * Transforms a library to make all operations log its activity
 * 
 * @param {Object} lib 
 */
export const debugLibrary = lib => {
  const names = Object.keys(lib);
  names.forEach(name => {
    const fn = lib[name];
    lib[name] = (proc, env) => {
      const next = proc.stack[proc.stack.length - 1];
      const next2 = proc.stack[proc.stack.length - 2];
      console.log("at", proc.time, name, next, next2);
      fn(proc, env);
    };
  });
  return names;
};
