import { process, lib } from "..";
import { logger } from "./debug";

describe("core library", () => {
  test("@wait", () => {
    const proc = process({ time: 2 }).load([1, lib.wait])
    proc.exec();
    expect(proc.time).toEqual(3);
  });

  test("@call", () => {
    const log = logger();
    process().load(["hi", "log", lib.call]).exec({ log });
    expect(log.output).toEqual(["hi:0"]);
  });

  test("@defn", () => {
    const log = logger();
    const program = [["hello", log, log], "hi", lib.defn, "one", "hi", lib.call];
    process().load(program).exec();
    expect(log.output).toEqual(["hello:0", "one:0"]);
  });

  test("@get", () => {
    const log = logger();
    const root = { context: { a: "A1", b: "B1", c: "C1" } };
    const parent = { context: { a: "A2", b: "B2" }, parent: root };
    const current = { context: { a: "A3" }, parent: parent };

    const program = ["a", lib.get, log, "b", lib.get, log, "c", lib.get, log];
    process(current).load(program).exec();
    expect(log.output).toEqual(["A3:0", "B2:0", "C1:0"]);
  });

  test('@let', () => {
    const proc = process();
    proc.load([440, 'freq', lib.let]).exec();
    expect(proc.context).toEqual({ freq: 440 });
  })
});
