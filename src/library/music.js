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
   * @param {string} type
   * @param {string} tonic
   * @param {number} numberOfNotes
   * 
   * @example
   * ['major', 'C4', 8, '@scale']
   */
  "@scale": proc => {
    const num = proc.stack.pop();
    const tonic = pitch(proc.stack.pop());
    const type = proc.stack.pop();

    const notes = scales[type] ? degrees(scales[type](tonic), num) : [];
    proc.stack.push(notes);
  }
};
