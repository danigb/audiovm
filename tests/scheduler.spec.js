import { lib, scheduler, jsclock } from "..";
import { logger } from "./debug";

jest.useFakeTimers();

describe("scheduler", () => {
  it("runs a program in time", () => {
    const log = logger();
    const run = scheduler({}, jsclock(0.3));
    run([0.5, lib.wait, "A", log]);
    jest.runTimersToTime(100);
    expect(log.output).toEqual([]);
    jest.runTimersToTime(1000);
    expect(log.output).toEqual(["A:0.5"]);
  });

  it("coroutine style scheduling", () => {
    const log = logger();
    const run = scheduler();
    run([0.1, lib.wait, "A1", log, 0.8, lib.wait, "A2", log]);
    run([0.2, lib.wait, "B1", log, 0.5, lib.wait, "B2", log]);
    run([0.25, lib.wait, "C1", log, 0.25, lib.wait, "C2", log]);
    jest.runTimersToTime(1000);
    expect(log.output).toEqual([
      "A1:0.1",
      "B1:0.2",
      "C1:0.25",
      "C2:0.5",
      "B2:0.7",
      "A2:0.9"
    ]);
  });
});
