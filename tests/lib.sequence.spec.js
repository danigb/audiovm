import { process } from "../src/vm";
import sequence from "../src/library/sequence";

const env = { lib: sequence };

const logger = (output = []) => {
  const log = proc => output.push(`${proc.time}:${proc.stack.pop()}`);
  log.output = output;
  return log;
};

describe("sequence", () => {
  test("@each", () => {
    const log = logger();
    process().load([[1, 2, 3], [log], "@each"]).exec(env);
    expect(log.output).toEqual(["0:1", "0:2", "0:3"]);
  });
});
