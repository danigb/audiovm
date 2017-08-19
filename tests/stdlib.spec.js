import { process } from "..";
import stdlib from "../src/library/stdlib";

const logger = (output = []) => {
  stdlib["@log"] = proc => output.push(proc.time + ":" + proc.stack.pop());
  return output;
};

describe("core library", () => {
  test("@wait", () => {
    const proc = process({ time: 2 }).load([1, "@wait"]).exec(stdlib);
    expect(proc.time).toEqual(3);
  });

  test("@call", () => {
    const output = logger();
    process().load(["hi", "log", "@call"]).exec(stdlib);
    expect(output).toEqual(["0:hi"]);
  });

  test("@defn", () => {
    const output = logger();
    process()
      .load([["hello", "@log", "@log"], "hi", "@defn", "one", "@hi"])
      .exec(stdlib);

    expect(output).toEqual(["0:hello", "0:one"]);
  });

  test("@get", () => {
    const output = logger();
    const root = { context: { a: "A1", b: "B1", c: "C1" } };
    const parent = { context: { a: "A2", b: "B2" }, parent: root };
    const current = { context: { a: "A3" }, parent: parent };

    process(current)
      .load(["a", "@get", "@log", "b", "@get", "@log", "c", "@get", "@log"])
      .exec(stdlib);
    expect(output).toEqual(["0:A3", "0:B2", "0:C1"]);
  });

  test("@set", () => {
    const root = { context: { a: "A1", b: "B1", c: "C1" } };
    const parent = { context: { a: "A2", b: "B2" }, parent: root };
    const current = { context: { a: "A3" }, parent: parent };

    process(current)
      .load(["A", "a", "@set", "B", "b", "@set", "C", "c", "@set"])
      .exec(stdlib);
    expect(current.context).toEqual({ a: "A" });
    expect(parent.context).toEqual({ a: "A2", b: "B" });
    expect(root.context).toEqual({ a: "A1", b: "B1", c: "C" });
  });

  test("@let", () => {
    const proc = process();
    proc.load([440, "freq", "@let"]).exec(stdlib);
    expect(proc.context).toEqual({ freq: 440 });
  });
});
