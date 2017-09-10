import { fork, exec } from "../../src/process";
import scope from "../../src/library/scope";
import { logger } from "../support";

const global = { scope: scope };

const run = proc => exec(Infinity, proc, global);

describe.skip("scope operations", () => {
  test("@defn", () => {
    const output = logger();
    process().run([["hello", "@log", "@log"], "hi", "@defn", "one", "@hi"]);
    exec(Infinity, proc, global);

    expect(output).toEqual(["0:hello", "0:one"]);
  });

  test("@get", () => {
    const output = logger();
    const root = { context: { a: "A1", b: "B1", c: "C1" } };
    const parent = { context: { a: "A2", b: "B2" }, parent: root };
    const current = { context: { a: "A3" }, parent: parent };

    process(current).run([
      "a",
      "@get",
      "@log",
      "b",
      "@get",
      "@log",
      "c",
      "@get",
      "@log"
    ]);
    exec(Infinity, proc, global);
    expect(output).toEqual(["0:A3", "0:B2", "0:C1"]);
  });

  test("@set", () => {
    const root = { context: { a: "A1", b: "B1", c: "C1" } };
    const parent = { context: { a: "A2", b: "B2" }, parent: root };
    const current = { context: { a: "A3" }, parent: parent };

    process(current).run([
      "A",
      "a",
      "@set",
      "B",
      "b",
      "@set",
      "C",
      "c",
      "@set"
    ]);
    exec(Infinity, proc, global);
    expect(current.context).toEqual({ a: "A" });
    expect(parent.context).toEqual({ a: "A2", b: "B" });
    expect(root.context).toEqual({ a: "A1", b: "B1", c: "C" });
  });

  test("@let", () => {
    const proc = process();
    proc.run([440, "freq", "@let"]);
    exec(Infinity, proc, global);
    expect(proc.context).toEqual({ freq: 440 });
  });
});
