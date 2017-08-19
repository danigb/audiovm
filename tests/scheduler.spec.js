import { scheduler } from "../src/vm";
import stdlib from "../src/library/stdlib";

jest.useFakeTimers();

const env = { lib: stdlib };

const logger = (output = []) => {
  stdlib["@log"] = proc => output.push(proc.time + ":" + proc.stack.pop());
  return output;
};

describe("scheduler", () => {
  it("forks a program in time", () => {
    const output = logger();

    const s = scheduler(env);
    s.fork(null, [0.5, "@wait", "A", "@log"]);
    jest.runTimersToTime(100);
    expect(output).toEqual([]);
    jest.runTimersToTime(1000);
    expect(output).toEqual(["0.5:A"]);
  });

  it("coroutine style scheduling", () => {
    const output = logger();

    const s = scheduler(env);
    s.fork(null, [0.1, "@wait", "A1", "@log", 0.8, "@wait", "A2", "@log"]);
    s.fork(null, [0.2, "@wait", "B1", "@log", 0.5, "@wait", "B2", "@log"]);
    s.fork(null, [0.25, "@wait", "C1", "@log", 0.25, "@wait", "C2", "@log"]);
    jest.runTimersToTime(1000);
    expect(output).toEqual([
      "0.1:A1",
      "0.2:B1",
      "0.25:C1",
      "0.5:C2",
      "0.7:B2",
      "0.9:A2"
    ]);
  });

  it("return processes", () => {
    const s = scheduler(env);
    const proc1 = s.fork(null, []);
    const proc2 = s.fork(null, []);
    expect(s.processes()).toContain(proc1);
    expect(s.processes()).toContain(proc2);
  });

  it("finds processes", () => {
    const s = scheduler(env);
    const proc1 = s.fork(null, []);
    expect(s.find(proc1.id)).toBe(proc1);
  });

  it("removes processes", () => {
    const s = scheduler(env);
    const proc1 = s.fork(null, []);
    const proc2 = s.fork(null, []);
    expect(s.remove(proc1.id)).toBe(true);
    expect(s.processes().length).toBe(1);
    expect(s.remove(proc1.id)).toBe(false);
    expect(s.remove(proc2.id)).toBe(true);
    expect(s.processes().length).toBe(0);
  });
});
