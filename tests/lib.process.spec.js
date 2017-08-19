import { process, scheduler } from "../src/vm";
import proclib from "../src/library/process";

jest.useFakeTimers();
const wait = delay => proc => (proc.time += delay);
const noop = () => null;
const env = { lib: proclib };

describe("process library", () => {
  test("@id", () => {
    const proc = process().load(["name", "@id"]);
    expect(proc.id).not.toEqual("name");
    proc.exec(env);
    expect(proc.id).toEqual("name");
  });

  test("@exit", () => {
    const proc = process().load(["@exit", "name", "@id"]);
    proc.exec(env);
    expect(proc.id).not.toEqual("name");
  });

  test("@repeat", () => {
    let times = 0;
    process().load([[() => times++], 10, "@repeat"]).exec(env);
    expect(times).toEqual(10);
  });

  test("@forever", () => {
    let times = 0;
    expect(() =>
      process().load([[() => times++], "@forever"]).exec(env, Infinity, 100)
    ).toThrow();
    expect(times).toEqual(33);
  });

  test("@fork", () => {
    const s = scheduler(env);
    s.fork(null, [[wait(10), noop], "@fork", wait(2), noop]);

    jest.runTimersToTime(1 * 1000);
    expect(s.processes().length).toEqual(2);
    jest.runTimersToTime(5 * 1000);
    expect(s.processes().length).toEqual(1);
    jest.runTimersToTime(12 * 1000);
    expect(s.processes().length).toEqual(0);
  });

  test("@loop", () => {
    let count = 0;
    const tick = () => count++;

    const s = scheduler(env);
    s.fork(null, [[tick, wait(1)], "@loop", wait(2), noop]);

    jest.runTimersToTime(0.5 * 1000);
    expect(s.processes().length).toEqual(2);
    jest.runTimersToTime(10 * 1000);
    expect(s.processes().length).toEqual(1);
    expect(count).toBe(11);
  });
});
