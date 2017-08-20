export default function transpiler(rules = []) {
  return function transpile(program) {
    if (!Array.isArray(program)) return transpile([program])[0];
    return program.reduce((output, op, index, input) => {
      for (let i = 0; i < rules.length; i++) {
        const test = rules[i].test(op);
        if (test) {
          rules[i](output, op, index, input, transpile, test);
          return output;
        }
      }
      if (Array.isArray(op)) output.push(transpile(op));
      else output.push(op);
      return output;
    }, []);
  };
}
