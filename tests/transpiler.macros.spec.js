import compile from "../src/transpiler/macros";

describe("macros", () => {
  it("## comments: skip comments", () => {
    const program = ["## hello world", "@pluck"];
    const compiled = ["@pluck"];
    expect(compile(program)).toEqual(compiled);
  });

  it("@>> forward direction", () => {
    const program = [">>@let-notes", "@scale", "C", "major", 15];
    const compiled = [15, "major", "C", "@scale", "notes", "@let"];
    expect(compile(program)).toEqual(compiled);
  });

  it("@>> forward direction: reverses only current array", () => {
    const program = [">>@repeat", 4, ["@pluck", "@wait-1"]];
    const compiled = [["@pluck", 1, "@wait"], 4, "@repeat"];
    expect(compile(program)).toEqual(compiled);
  });

  it("forward must be first of an array", () => {
    const program = ["@op", ">>@op"];
    expect(() => compile(program)).toThrow();
  });

  it("splits [@name-param] into [param, @name]", () => {
    const program = [440, "@set-freq"];
    const compiled = [440, "freq", "@set"];
    expect(compile(program)).toEqual(compiled);
    const p2 = [["@pluck", "@wait-1"], 4, "@repeat"];
    const c2 = [["@pluck", 1, "@wait"], 4, "@repeat"];
    expect(compile(p2)).toEqual(c2);
  });

  it("handles @name-value", () => {
    expect(compile(["@kick:note-440"])).toEqual([440, "@kick:note"]);
    expect(compile(["@wait-0.5"])).toEqual([0.5, "@wait"]);
  });

  it("compiles recursively", () => {
    const program = [[440, "@set-freq"], "@eval"];
    const compiled = [[440, "freq", "@set"], "@eval"];
    expect(compile(program)).toEqual(compiled);
  });
});
