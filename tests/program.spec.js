import { init } from "../src/program";

describe("program", () => {
  it("is a data structure that can be serialized", () => {
    const proc = {};
    const program = init(proc);
    expect(JSON.parse(JSON.stringify(program))).toEqual(program);
  });
});
