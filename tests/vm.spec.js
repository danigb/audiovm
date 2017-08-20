import { process, scheduler } from "../src/vm";
import { env, logger } from "./debug";

jest.useFakeTimers();

describe("process", () => {
  it("exec run funtions", () => {
    const log = logger();
    process().load(["A", log, "B", log]).exec();
    expect(log.output).toEqual(["0:A", "0:B"]);
  });

  it("exec from library", () => {
    const log = logger();
    const env = { lib: { "@log": log } };
    process().load(["A", "@log", "B", "@log"]).exec(env);
    expect(log.output).toEqual(["0:A", "0:B"]);
  });

  it("pushes to the stack by default", () => {
    const log = logger();
    const proc = process().load([1, "A", [log]]);
    proc.exec();
    expect(proc.stack).toEqual([1, "A", [log]]);
    expect(log.output).toEqual([]);
  });
});

describe("scheduler", () => {
  it("forks a program in time", () => {
    const s = scheduler(env());
    s.fork(null, [0.5, "@wait", "A", "@log"]);
    jest.runTimersToTime(100);
    expect(s.env.output).toEqual([]);
    jest.runTimersToTime(1000);
    expect(s.env.output).toEqual(["0.5:A"]);
  });

  it("coroutine style scheduling", () => {
    const s = scheduler(env());
    s.fork(null, [0.1, "@wait", "A1", "@log", 0.8, "@wait", "A2", "@log"]);
    s.fork(null, [0.2, "@wait", "B1", "@log", 0.5, "@wait", "B2", "@log"]);
    s.fork(null, [0.25, "@wait", "C1", "@log", 0.25, "@wait", "C2", "@log"]);
    jest.runTimersToTime(1000);
    expect(s.env.output).toEqual([
      "0.1:A1",
      "0.2:B1",
      "0.25:C1",
      "0.5:C2",
      "0.7:B2",
      "0.9:A2"
    ]);
  });

  it("return processes", () => {
    const s = scheduler();
    const proc1 = s.fork(null, []);
    const proc2 = s.fork(null, []);
    expect(s.processes()).toContain(proc1);
    expect(s.processes()).toContain(proc2);
  });

  it("finds processes", () => {
    const s = scheduler();
    const proc1 = s.fork(null, []);
    expect(s.find(proc1.id)).toBe(proc1);
  });

  it("removes processes", () => {
    const s = scheduler();
    const proc1 = s.fork(null, []);
    const proc2 = s.fork(null, []);
    expect(s.remove(proc1.id)).toBe(true);
    expect(s.count()).toBe(1);
    expect(s.remove(proc1.id)).toBe(false);
    expect(s.remove(proc2.id)).toBe(true);
    expect(s.count()).toBe(0);
  });
});
