import { process, lib, scheduler, jsclock } from '..';

jest.useFakeTimers();

const logger = () => {
  const log = (proc) => {
    log.output.push(proc.stack.pop());
  }
  log.output = [];
  return log;
}

describe('process', () => {
  it('execs program', () => {
    const log = logger();
    process([1, log, 2, log])();
    expect(log.output).toEqual([1, 2]);
  })
})

describe('scheduler', () => {
  it('runs a program in time', () => {
    const log = logger();
    const run = scheduler({}, jsclock(0.3));
    run([0.5, lib.wait, 'hi', log]);
    jest.runTimersToTime(100);
    expect(log.output).toEqual([]);
    jest.runTimersToTime(1000);
    expect(log.output).toEqual(['hi']);
  })
  it('coroutine procs', () => {
    const log = logger();
    const run = scheduler();
    run([0.1, lib.wait, 'A1', log, 0.8, lib.wait, 'A2', log]);
    run([0.2, lib.wait, 'B1', log, 0.3, lib.wait, 'B2', log]);
    run([0.3, lib.wait, 'C1', log, 0.3, lib.wait, 'C2', log]);
    jest.runTimersToTime(1000);
    expect(log.output).toEqual(['A1', 'B1', 'C1', 'B2', 'C2', 'A2']);
  })
})

describe('core library', () => {
  test('wait', () => {
    const proc = process([1, lib.wait], 2)();
    expect(proc.time).toEqual(3);
  })

  test('call', () => {
    const log = logger();
    process(['hi', 'log', lib.call])({ log });
    expect(log.output).toEqual(['hi']);
  })
})