export const logger = () => {
  const log = proc => {
    log.output.push(`${proc.stack.pop()}:${proc.time}`);
  };
  log.output = [];
  return log;
};
