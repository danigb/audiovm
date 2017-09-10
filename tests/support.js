export const logger = (output = []) => {
  const log = proc => output.push(`${proc.time}:${proc.stack.pop()}`);
  log.output = output;
  return log;
};

export const waitFor = delay => proc => (proc.time += delay);

export const wait = proc => (proc.time += proc.stack.pop());

export const noop = () => null;

export const createScope = () => {
  const log = logger();

  return {
    output: log.output,
    "@log": log,
    "@wait": wait,
    "@noop": noop
  };
};
