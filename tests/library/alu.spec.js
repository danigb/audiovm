import { fork, exec } from "../../src/process";
import alu from "../../src/library/alu";

const global = { scope: alu };

const logger = (output = []) => {
  const log = proc => output.push(`${proc.time}:${proc.stack.pop()}`);
  log.output = output;
  return log;
};

describe.skip("arithmetic", () => {
  test("@sub", () => {
    const proc = fork([10, 4, "@sub"]);
    exec(Infinity, proc, global);
    expect(proc.stack).toEqual([6]);
  });

  test("@wrap", () => {
    const proc = fork([5, -2, "@wrap"]);
    exec(Infinity, proc, global);
    expect(proc.stack).toEqual([-1]);
  });
});

describe("logic operations", () => {
  test("@>", () => {
    const proc = fork([3, 4, "@>"]);
    exec(Infinity, proc, global);
    expect(proc.stack).toEqual([false]);
  });

  test("@cond", () => {
    let log = logger();
    const trueProgram = fork([["TRUE", log], ["FALSE", log], true, "@cond"]);
    exec(Infinity, trueProgram, global);
    expect(log.output).toEqual(["0:TRUE"]);

    log = logger();
    const falseProgram = fork([["TRUE", log], ["FALSE", log], false, "@cond"]);
    exec(Infinity, falseProgram, global);
    expect(log.output).toEqual(["0:FALSE"]);
  });
});
