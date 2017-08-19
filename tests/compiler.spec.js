import { compiler } from "..";

describe("compiler", () => {
  it("splits [@name-param] into [param, @name]", () => {
    const program = [440, "@set-freq"];
    const compiled = [440, "freq", "@set"];
    expect(compiler()(program)).toEqual(compiled);
  });

  it("compiles recursively", () => {
    const program = [[440, '@set-freq'], "@eval"];
    const compiled = [[440, 'freq', '@set'], '@eval'];
    expect(compiler()(program)).toEqual(compiled);
  });

});
