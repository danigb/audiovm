export { default as initGibberish } from "./gibberish";
import macros from "./transpiler/macros";
import legacy from "./transpiler/macros";
export const Transpile = { macros, legacy };
import * as debug from "./debug";
export const Debug = debug;
