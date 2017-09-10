import { fork, exec, load } from "../../src/process";
import repetition from "../../src/library/repetition";
import { logger, waitFor, noop } from "../support";
import { createVM, schedule, resume } from "../../src/vm";

const global = { scope: repetition };

const run = proc => exec(Infinity, proc, global);

global.scope["@eval"] = proc => {
  load(proc.stack.pop(), proc);
};

describe.only("repetition", () => {
  test("@repeat", () => {
    let times = 0;
    const proc = fork([[() => times++], 10, "@repeat"]);
    run(proc);
    expect(times).toEqual(10);
  });

  test("@forever", () => {
    let times = 0;
    const proc = fork([[() => times++], "@forever"]);
    expect(() => run(proc)).toThrow();
    expect(times).toEqual(333);
  });

  test.skip("@loop", () => {
    const log = logger();

    const vm = createVM(global);
    const proc = fork([
      ["*", log, waitFor(1)],
      "@loop",
      waitFor(3),
      "ends",
      log
    ]);
    schedule(proc, vm);
    resume(1.1, vm);
    expect(log.output).toBe();
  });

  test("@each", () => {
    const log = logger();
    const proc = fork([[1, 2, 3], [log], "@each"]);
    run(proc);
    expect(log.output).toEqual(["0:1", "0:2", "0:3"]);
  });
});
