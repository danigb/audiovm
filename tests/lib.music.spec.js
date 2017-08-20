import { process } from "../src/vm";
import music from "../src/library/music";
import { logger } from "./debug";

const env = { lib: music };

describe("music operations", () => {
  test("@mtof", () => {
    const log = logger();
    process().load([69, "@mtof", log]).exec(env);
    expect(log.output).toEqual(["0:440"]);
  });

  test("@scale", () => {
    const log = logger();
    process().load(["major", "C4", 4, "@scale", log]).exec(env);
    expect(log.output).toEqual(["0:60,62,64,65"]);
  });
});
