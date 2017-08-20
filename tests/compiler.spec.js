import { compiler } from "../src/vm";

const compile = compiler();

describe("compiler", () => {
  it("splits [@name-param] into [param, @name]", () => {
    const program = [440, "@set-freq"];
    const compiled = [440, "freq", "@set"];
    expect(compile(program)).toEqual(compiled);
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
