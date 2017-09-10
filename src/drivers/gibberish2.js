import { resume } from "../vm";

const init = Gibberish => {
  if (!Gibberish && typeof window !== undefined && window.Gibberish) {
    Gibberish = window.Gibberish;
  }
  if (!Gibberish.context) {
    Gibberish.init();
  }
  return Gibberish;
};

/**
 * Create a `run` function using the Gibberish library
 * 
 * @function
 * @name initGibberish
 * @param [Gibberish] Gibberish
 * @return {function} a function to run VM programs
 * 
 * @example
 * const run = AudioVM.initGibberish();
 * run([['@pluck', 1, '@wait'], '@loop']);
 * @example
 * // es6 modules
 * import { initGibberish } from 'audiovm'
 * const run = initGibberish();
 */
export default (vm, Gibberish) => {
  Gibberish = init(Gibberish);
  const instruments = createRepository(Gibberish);
  updateScope(instruments, vm.scope);

  const bpm2bpa = 1 / Gibberish.context.sampleRate;
  Gibberish.sequencers.push({
    tick: () => resume(bpm2bpa, vm)
  });

  return vm;
};

function updateScope(instruments, scope) {
  return instruments.names.reduce((lib, name) => {
    lib["@" + name] = () => {
      const inst = instruments.get(name);
      inst.note();
    };
    lib["@" + name + ":note"] = proc => {
      const inst = instruments.get(name);
      const param = proc.stack.pop();
      inst[param] = proc.stack.pop();
      inst.note();
    };
    lib["@" + name + ":set"] = proc => {
      const inst = instruments.get(name);
      const key = proc.stack.pop();
      inst[key] = proc.stack.pop();
    };
    return lib;
  }, scope);
}

function createRepository(Gibberish) {
  const factories = createFactories(Gibberish);
  const names = Object.keys(factories);
  const cache = [];
  const get = name => cache[name] || (cache[name] = factories[name]());
  return { get, names, cache };
}

function createFactories(Gibberish) {
  return {
    kick: () => new Gibberish.Kick({ decay: 0.2, freq: 80 }).connect(),
    snare: () => new Gibberish.Snare({ amp: 0.3, snappy: 1.5 }).connect(),
    hat: () => new Gibberish.Hat({ amp: 1.5 }).connect(),
    conga: () => new Gibberish.Conga({ amp: 0.25, freq: 400 }).connect(),
    tom: () => new Gibberish.Tom({ amp: 0.25, freq: 400 }).connect(),
    pluck: () => {
      const pluck = new Gibberish.PolyKarplusStrong({
        freq: 400,
        maxVoices: 32,
        amp: 0.7
      }).connect();
      const _note = pluck.note.bind(pluck);
      const sampleRate = Gibberish.sampleRate;
      pluck.note = () => {
        const freq = pluck.freq;
        const amp = pluck.amp;
        pluck.damping = 1 - -6 / Math.log(freq / sampleRate);
        _note(freq, amp);
      };
      return pluck;
    },
    bass: () =>
      new Gibberish.MonoSynth({
        attack: 44,
        decay: Gibberish.Time.beats(0.25),
        filterMult: 0.25,
        octave2: 0,
        octave3: 0
      }).connect()
  };
}
