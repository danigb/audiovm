import { process, compiler, lib } from "..";
import { logger } from "./debug";

describe("compiler", () => {
  it("compiles recursively", () => {
    const program = [["freq", "@set"], "set-freq", "@defn"];
    const compiled = [["freq", lib.set], "set-freq", lib.defn];
    expect(compiler()(program)).toEqual(compiled);
  });

  it("compile core library functions", () => {
    const keys = Object.keys(lib);
    const program = keys.map(name => `@${name}`);
    const compiled = keys.map(name => lib[name]);
    expect(compiler()(program)).toEqual(compiled);
  });

  it("convert @ into function calls", () => {
    const log = logger();
    const program = ["hello", "@log"];
    process().load(compiler()(program)).exec({ log });
    expect(log.output).toEqual(["hello:0"]);
  });

  it("splits [@name-param] into [param, @name]", () => {
    const program = [440, "@set-freq"];
    const compiled = [440, "freq", lib.set];
    expect(compiler()(program)).toEqual(compiled);
  });
});
