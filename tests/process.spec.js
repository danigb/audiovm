import { fork, load, exec } from "../src/process";
import { logger } from "./support";

describe("process", () => {
  it("is a data structure that can be serialized", () => {
    const proc = fork([], { time: 1, speed: 0.5 });
    expect(JSON.parse(JSON.stringify(proc))).toEqual(proc);
  });

  it("can be loaded with instructions", () => {
    const proc = fork([1, 2, 3]);
    expect(proc.operations).toEqual([3, 2, 1]);
  });

  it("execs function in operations", () => {
    const log = logger();
    const proc = fork(["hi", log]);
    exec(Infinity, proc);
    expect(log.output).toEqual(["0:hi"]);
  });

  it("execs @op from scope object", () => {
    const log = logger();
    const scope = { "@log": log };
    const proc = fork(["hi", "@log"]);
    exec(Infinity, proc, { scope });
    expect(log.output).toEqual(["0:hi"]);
  });
});
