import { createVM, spawn, resume } from "../src/vm.js";
import { createScope } from "./support";

describe("virtual machine", () => {
  it("creates context", () => {
    const vm = createVM();
    expect(vm).not.toBe(undefined);
  });
  it("runs a program", () => {
    const vm = createVM(createScope());
    spawn([1, "@wait", "A", "@log"], vm);
    resume(0.5, vm);
    expect(vm.scope.output).toEqual([]);
    resume(2, vm);
    expect(vm.scope.output).toEqual(["1:A"]);
  });

  it.skip("coroutine style scheduling", () => {
    const vm = createVM(createScope());
    spawn([0.1, "@wait", "A1", "@log", 0.8, "@wait", "A2", "@log"], vm);
    spawn([0.2, "@wait", "B1", "@log", 0.5, "@wait", "B2", "@log"], vm);
    spawn([0.25, "@wait", "C1", "@log", 0.25, "@wait", "C2", "@log"], vm);
    while (resume(0.1, vm)) {}
    expect(vm.scope.output).toEqual([
      "0.1:A1",
      "0.2:B1",
      "0.25:C1",
      "0.5:C2",
      "0.7:B2",
      "0.9:A2"
    ]);
  });
});
