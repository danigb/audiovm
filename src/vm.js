import Emitter from "tiny-emitter";
import Queue from "fastpriorityqueue";
import { init, addProcess, removeProcess } from "./program";
import { fork, exec } from "./process";

export const createVM = (scope = {}) => {
  const vm = new Emitter();
  vm.queue = new Queue();
  vm.scope = scope;
  vm.time = 0;
  vm.speed = 1;

  // FIXME
  vm.run = i => spawn(i, vm);
  return vm;
};

export const schedule = (proc, vm) => vm.queue.add(proc);

export const run = (program, vm) => {
  const proc = fork(program.instructions, vm);
  addProcess(proc, program);
  proc.program = program.id;
  schedule(proc, vm);
  return program;
};

export const spawn = (instructions, vm, name) => {
  const program = init(instructions, () => {
    vm.emit("ended", program);
    vm.emit("ended:" + program.id.slice(1), program);
    vm.scope[program.id] = null;
  });
  vm.scope[program.id] = program;
  return run(program, vm);
};

/**
 * Resume a vm machine for a period of time
 * 
 * @param {number} duration 
 * @param {vm} vm 
 */
export const resume = (duration, vm) => {
  const endsAt = vm.time + duration * vm.speed;
  let proc = vm.queue.poll();
  while (proc && proc.time < endsAt) {
    if (exec(endsAt, proc, vm)) {
      schedule(proc, vm);
    } else {
      const program = vm.scope[proc.program];
      if (program) removeProcess(proc, program);
    }
    proc = vm.queue.poll();
  }
  if (proc) schedule(proc, vm);
  vm.time = endsAt;
  return vm.queue.size;
};
