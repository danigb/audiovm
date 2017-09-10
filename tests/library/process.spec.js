import { fork, exec } from "../../src/process";
import process from "../../src/library/process";
import { waitFor, noop } from "../support";

const global = { scope: process };

describe("process operations", () => {
  test("@eval", () => {
    const proc = fork([[1, 2, 3], "@eval"]);
    exec(Infinity, proc, global);
    expect(proc.operations).toEqual();
  });
});

describe.skip("process operations", () => {
  test("@wait", () => {
    const proc = process(null, 2).run([1, "@wait"]);
    proc.resume(env);
    expect(proc.time).toEqual(3);
  });

  test("@id", () => {
    const proc = process().run(["name", "@id"]);
    expect(proc.id).not.toEqual("name");
    proc.resume(env);
    expect(proc.id).toEqual("name");
  });

  test("@exit", () => {
    const proc = process().run(["@exit", "name", "@id"]);
    proc.resume(env);
    expect(proc.id).not.toEqual("name");
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

  test("@spawn sets id", () => {
    const s = scheduler(env);
    s.fork(null, [[waitFor(0.5)], "child", "@spawn"]);
    jest.runTimersToTime(1 * 1000);
    expect(s.count()).toEqual(1);
    expect(s.processes()[0].id).toEqual("child");
  });
});
