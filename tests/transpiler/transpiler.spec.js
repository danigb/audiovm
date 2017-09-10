import transpiler, { when } from "../../src/transpiler/transpiler";

describe("transpiler", () => {
  it("preserves code by default", () => {
    const program = ["a", "b", ["c", ["d", "e"], "f"], "g"];
    expect(transpiler()(program)).toEqual(program);
  });

  it("can transpile a single operation", () => {
    expect(transpiler()("@op")).toEqual("@op");
  });

  it("accepts a transform function", () => {
    const transform = (output, op) => {
      if (typeof op === "string") {
        output.push(op.toUpperCase());
        return output;
      } else {
        return null;
      }
    };
    const transpile = transpiler(transform);
    expect(transpile(["a", [1, "b"]])).toEqual(["A", [1, "B"]]);
  });

  it("decorates with a predicate", () => {
    const transform = when(op => typeof op === "string")((output, op) =>
      output.push(op.toUpperCase())
    );
    const transpile = transpiler(transform);
    expect(transpile(["a", [1, "b"]])).toEqual(["A", [1, "B"]]);
  });
});
