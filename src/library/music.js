/**
 * Music operations
 * @module music
 */
import { pitch, toFreq, degrees, scales } from "microtonal";

export default {
  /**
   * Convert midi to frequency
   * @param {number} midiNoteNumber
   * @return {number} frequency
   * 
   * @example
   * [60, '@mtof', '@pluck:note']
   */
  "@mtof": proc => {
    const midi = pitch(proc.stack.pop());
    proc.stack.push(toFreq(midi));
  },

  /**
   * Create a scale
   * @param {string} tonic
   * @param {string} type
   * @param {number} numberOfNotes
   * 
   * @example
   * ['C4', 'major', 8, '@scale']
   */
  "@scale": proc => {
    const num = proc.stack.pop();
    const name = proc.stack.pop();
    const tonic = pitch(proc.stack.pop());

    const scale = scales[name] ? degrees(scales[name](tonic), num) : [];
    proc.stack.push(scale);
  }
};
