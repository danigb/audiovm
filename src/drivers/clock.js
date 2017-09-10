import { resume } from "../vm";

/**
 * A reference clock. A clock is a function that accepts a callback
 * and call the callback at a given interval
 * 
 * This clock is not to be used with music (Gibberish and Web Audio
 * API provides better timing options) but as a reference on how
 * to implement a clock and to perform tests.
 * 
 * @private
 * @param {Number} interval - the interval of the clock in seconds
 * @return {Function} 
 */
export default (vm, interval = 0.1, createVM) => {
  const id = setInterval(() => resume(interval, vm), interval * 1000);
  vm.stop = () => clearInterval(id);
  return vm;
};
