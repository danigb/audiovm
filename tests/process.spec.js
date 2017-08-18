import { process } from "..";
import { logger } from "./debug";

jest.useFakeTimers();

describe("process", () => {
  it("execs program", () => {
    const log = logger();
    process().load(["A", log, "B", log]).exec();
    expect(log.output).toEqual(["A:0", "B:0"]);
  });
});
