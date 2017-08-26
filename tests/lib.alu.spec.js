import { process } from "../src/vm";
import alu from "../src/library/alu";

const env = { lib: alu };

const logger = (output = []) => {
  const log = proc => output.push(`${proc.time}:${proc.stack.pop()}`);
  log.output = output;
  return log;
};

describe("arithmetic", () => {
  test("@sub", () => {
    const proc = process().load([10, 4, "@sub"]);
    proc.exec(env);
    expect(proc.stack).toEqual([6]);
  });

  test("@wrap", () => {
    const proc = process().load([5, -2, "@wrap"]);
    proc.exec(env);
    expect(proc.stack).toEqual([-1]);
  });
});

describe("logic operations", () => {
  test("@>", () => {
    const proc = process().load([3, 4, "@>"]);
    proc.exec(env);
    expect(proc.stack).toEqual([false]);
  });

  test("@cond", () => {
    let log = logger();
    process().load([["TRUE", log], ["FALSE", log], true, "@cond"]).exec(env);
    expect(log.output).toEqual(["0:TRUE"]);

    log = logger();
    process().load([["TRUE", log], ["FALSE", log], false, "@cond"]).exec(env);
    expect(log.output).toEqual(["0:FALSE"]);
  });
});
