import { fork, exec } from "../../src/process";
import music from "../../src/library/music";
import { logger } from "../support";

const global = { scope: music };

describe("music operations", () => {
  test("@mtof", () => {
    const log = logger();
    const proc = fork([69, "@mtof", log]);
    exec(Infinity, proc, global);
    expect(log.output).toEqual(["0:440"]);
  });

  test("@scale", () => {
    const log = logger();
    const proc = fork(["major", "C4", 4, "@scale", log]);
    exec(Infinity, proc, global);
    expect(log.output).toEqual(["0:60,62,64,65"]);
  });
});
