import { process } from "../src/vm";
import { logger } from "./debug";

describe("process", () => {
  it("exec run funtions", () => {
    const log = logger();
    process().load(["A", log, "B", log]).exec();
    expect(log.output).toEqual(["0:A", "0:B"]);
  });

  it("exec from library", () => {
    const log = logger();
    const env = { lib: { "@log": log } };
    process().load(["A", "@log", "B", "@log"]).exec(env);
    expect(log.output).toEqual(["0:A", "0:B"]);
  });

  it("pushes to the stack by default", () => {
    const log = logger();
    const proc = process().load([1, "A", [log]]);
    proc.exec();
    expect(proc.stack).toEqual([1, "A", [log]]);
    expect(log.output).toEqual([]);
  });
});
