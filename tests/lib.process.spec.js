import { process, scheduler } from "../src/vm";
import proclib from "../src/library/process";
import { waitFor, noop } from "./debug";

jest.useFakeTimers();
const env = { lib: proclib };

describe("process operations", () => {
  test("@wait", () => {
    const proc = process({ time: 2 }).load([1, "@wait"]).exec(env);
    expect(proc.time).toEqual(3);
  });

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
    s.fork(null, [[waitFor(10), noop], "@fork", waitFor(2), noop]);

    jest.runTimersToTime(1 * 1000);
    expect(s.count()).toEqual(2);
    jest.runTimersToTime(5 * 1000);
    expect(s.count()).toEqual(1);
    jest.runTimersToTime(12 * 1000);
    expect(s.count()).toEqual(0);
  });

  test("@loop", () => {
    let count = 0;
    const tick = () => count++;

    const s = scheduler(env);
    s.fork(null, [[tick, waitFor(1)], "@loop", waitFor(2), noop]);

    jest.runTimersToTime(0.5 * 1000);
    expect(s.count()).toEqual(2);
    jest.runTimersToTime(10 * 1000);
    expect(s.count()).toEqual(1);
    expect(count).toBe(11);
  });

  test("@spawn sets id", () => {
    const s = scheduler(env);
    s.fork(null, [[waitFor(0.5)], "child", "@spawn"]);
    jest.runTimersToTime(1 * 1000);
    expect(s.count()).toEqual(1);
    expect(s.processes()[0].id).toEqual("child");
  });
});
