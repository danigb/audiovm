import { scheduler } from "..";
import stdlib from "../src/library/stdlib";

jest.useFakeTimers();

const logger = (output = []) => {
  stdlib["@log"] = proc => output.push(proc.time + ":" + proc.stack.pop());
  return output;
};

describe("scheduler", () => {
  it("runs a program in time", () => {
    const output = logger();

    const run = scheduler(stdlib);
    run([0.5, "@wait", "A", "@log"]);
    jest.runTimersToTime(100);
    expect(output).toEqual([]);
    jest.runTimersToTime(1000);
    expect(output).toEqual(["0.5:A"]);
  });

  it("coroutine style scheduling", () => {
    const output = logger();

    const run = scheduler(stdlib);
    run([0.1, "@wait", "A1", "@log", 0.8, "@wait", "A2", "@log"]);
    run([0.2, "@wait", "B1", "@log", 0.5, "@wait", "B2", "@log"]);
    run([0.25, "@wait", "C1", "@log", 0.25, "@wait", "C2", "@log"]);
    jest.runTimersToTime(1000);
    expect(output).toEqual([
      "0.1:A1",
      "0.2:B1",
      "0.25:C1",
      "0.5:C2",
      "0.7:B2",
      "0.9:A2"
    ]);
  });
});
