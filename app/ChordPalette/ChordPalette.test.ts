import { getChordColor } from './ChordPalette.utils';
import type { tNoteWithOctave } from '../PianoBase/PianoBase.types';

describe('getChordColor for C', () => {
  const C_HUE = 0;
  const D_HUE = 30;
  const E_HUE = 60;
  const G_HUE = 180;
  const F_HUE = 120;

  // Test cases for solid colors (no chordNotesForGradient or empty array)
  describe('Solid Colors for C', () => {
    const testCasesSolid = [
      { quality: 'maj', expected: 'hsl(0, 80%, 50%)' },
      { quality: 'min', expected: 'hsl(0, 40%, 50%)' },
      { quality: 'dim', expected: 'hsl(0, 25%, 50%)' },
      { quality: 'aug', expected: 'hsl(0, 80%, 65%)' },
      { quality: 'sus2', expected: 'hsl(0, 80%, 40%)' },
      { quality: 'sus4', expected: 'hsl(0, 80%, 50%)' },
      { quality: 'maj7', expected: 'hsl(0, 100%, 50%)' },
      { quality: 'm7', expected: 'hsl(0, 60%, 50%)' },
      { quality: 'dom7', expected: 'hsl(0, 80%, 45%)' },
      { quality: 'maj9', expected: 'hsl(0, 100%, 55%)' },
      { quality: 'm9', expected: 'hsl(0, 60%, 55%)' },
      { quality: 'dom9', expected: 'hsl(0, 80%, 50%)' },
      { quality: 'maj11', expected: 'hsl(0, 100%, 60%)' },
      { quality: 'm11', expected: 'hsl(0, 60%, 60%)' },
      { quality: 'dom11', expected: 'hsl(0, 80%, 55%)' },
      { quality: 'maj13', expected: 'hsl(0, 100%, 65%)' },
      { quality: 'm13', expected: 'hsl(0, 60%, 65%)' },
      { quality: 'dom13', expected: 'hsl(0, 80%, 60%)' },
    ] as const;

    testCasesSolid.forEach(({ quality, expected }) => {
      it(`should return ${expected} for C${quality} without gradient notes`, () => {
        expect(getChordColor('C', quality)).toBe(expected);
      });

      it(`should return ${expected} for C${quality} with empty gradient notes array`, () => {
        expect(getChordColor('C', quality, [])).toBe(expected);
      });
    });

    it('should return default HSL for C with an unknown quality', () => {
      expect(getChordColor('C', 'unknownQuality' as any)).toBe('hsl(0, 100%, 50%)');
    });
  });

  // Test cases for gradient colors
  describe('Gradient Colors for C', () => {
    it('should return a solid color if only one note (C4) is provided for gradient', () => {
      const notes: tNoteWithOctave[] = ['C4'];
      expect(getChordColor('C', 'maj', notes)).toBe(`hsl(${C_HUE}, 100%, 50%)`);
    });

    it('should return a solid color if only one note (E4) is provided for gradient, ignoring baseNote C', () => {
      const notes: tNoteWithOctave[] = ['E4'];
      expect(getChordColor('C', 'maj', notes)).toBe(`hsl(${E_HUE}, 100%, 50%)`);
    });

    it('should generate a gradient for two notes (C4, E4)', () => {
      const notes: tNoteWithOctave[] = ['C4', 'E4'];
      const colorC = `hsl(${C_HUE}, 100%, 50%)`;
      const colorE = `hsl(${E_HUE}, 100%, 50%)`;
      const expected = `linear-gradient(to right, ${colorC} 0%, ${colorC} 50%, ${colorE} 50.00%, ${colorE} 100.00%)`;
      expect(getChordColor('C', 'maj', notes)).toBe(expected);
    });

    it('should generate a gradient for three notes (C4, E4, G4)', () => {
      const notes: tNoteWithOctave[] = ['C4', 'E4', 'G4'];
      const colorC = `hsl(${C_HUE}, 100%, 50%)`;
      const colorE = `hsl(${E_HUE}, 100%, 50%)`;
      const colorG = `hsl(${G_HUE}, 100%, 50%)`;
      const expected = `linear-gradient(to right, ${colorC} 0%, ${colorC} 50%, ${colorE} 50.00%, ${colorE} 75.00%, ${colorG} 75.00%, ${colorG} 100.00%)`;
      expect(getChordColor('C', 'maj', notes)).toBe(expected);
    });

    it('should generate a gradient for four notes (C4, D4, E4, F4)', () => {
      const notes: tNoteWithOctave[] = ['C4', 'D4', 'E4', 'F4'];
      const colorC = `hsl(${C_HUE}, 100%, 50%)`;
      const colorD = `hsl(${D_HUE}, 100%, 50%)`;
      const colorE = `hsl(${E_HUE}, 100%, 50%)`;
      const colorF = `hsl(${F_HUE}, 100%, 50%)`;
      const expected = `linear-gradient(to right, ${colorC} 0%, ${colorC} 50%, ${colorD} 50.00%, ${colorD} 66.67%, ${colorE} 66.67%, ${colorE} 83.33%, ${colorF} 83.33%, ${colorF} 100.00%)`;
      expect(getChordColor('C', 'maj', notes)).toBe(expected);
    });

    it('should handle a note not in NOTE_TO_HUE (defaulting to hue 0) within a gradient', () => {
      const notes: tNoteWithOctave[] = ['C4', 'X5' as tNoteWithOctave, 'G4'];
      const colorC = `hsl(${C_HUE}, 100%, 50%)`;
      const colorX = `hsl(0, 100%, 50%)`; // Default hue for X5
      const colorG = `hsl(${G_HUE}, 100%, 50%)`;
      const expected = `linear-gradient(to right, ${colorC} 0%, ${colorC} 50%, ${colorX} 50.00%, ${colorX} 75.00%, ${colorG} 75.00%, ${colorG} 100.00%)`;
      expect(getChordColor('C', 'maj', notes)).toBe(expected);
    });

    it('should return a solid color (default hue 0) if only one unknown note is provided for gradient', () => {
      const notes: tNoteWithOctave[] = ['X4' as tNoteWithOctave];
      expect(getChordColor('C', 'maj', notes)).toBe(`hsl(0, 100%, 50%)`);
    });
  });
});