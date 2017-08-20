import transpiler from "../src/transpiler";

describe("transpiler", () => {
  it("preserves code by default", () => {
    const program = ["a", "b", ["c", ["d", "e"], "f"], "g"];
    expect(transpiler()(program)).toEqual(program);
  });

  it("can transpile a single operation", () => {
    expect(transpiler()("@op")).toEqual("@op");
  });

  it("accept a transpiler rule", () => {
    const rule = (output, op) => output.push(op.toUpperCase());
    rule.test = op => typeof op === "string";
    const transpile = transpiler([rule]);
    expect(transpile(["a", [1, "b"]])).toEqual(["A", [1, "B"]]);
  });
});
