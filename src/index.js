import { createVM } from "./vm";
import library from "./library";
import gibberish from "./drivers/gibberish2";
import logger from "./drivers/logger";

export const initGibberish = scope =>
  logger(gibberish(createVM(Object.assign({}, library, scope))));
