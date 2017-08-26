import { process } from "../src/vm";
import sequence from "../src/library/sequence";
import { logger } from "./debug";

const env = { lib: sequence };
env.lib["@eval"] = proc => {
  proc.load(proc.stack.pop());
};

describe("sequence", () => {
  test("@each", () => {
    const log = logger();
    process().load([[1, 2, 3], [log], "@each"]).exec(env);
    expect(log.output).toEqual(["0:1", "0:2", "0:3"]);
  });
});
