import { fork, exec } from "../../src/process";
import time from "../../src/library/time";
import { logger } from "../support";

const global = { scope: time };

const run = proc => exec(Infinity, proc, global);

describe("time operations", () => {
  test("@wait", () => {
    const log = logger();
    const proc = fork([1, "@wait", "", log]);
    run(proc);
    expect(log.output).toEqual(["1:"]);
  });
  test("@sync", () => {});
  test("@pause", () => {});
  test("@resume", () => {});
  test("@stop", () => {});
});
