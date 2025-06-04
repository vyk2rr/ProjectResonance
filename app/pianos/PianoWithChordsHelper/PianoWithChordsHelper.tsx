import * as Tone from "tone";
import React, { useState } from "react";
import PianoBase from "../../PianoBase/PianoBase";
import type { PianoBaseProps, OctaveRangeType, ChordType } from "../../PianoBase/PianoBase.types";
import "./PianoWithChordsHelper.css";

type PianoWithChordsHelperProps = PianoBaseProps & {
  chord: string[],
  octaves: OctaveRangeType
}

export default function PianoWithChordsHelper({ chord, octaves = 2 }: PianoWithChordsHelperProps) {
  const [currentChord, setCurrentChord] = useState<string[]>([]);
  const [currentNote, setCurrentNote] = useState<string>("");
  const [selectedChordId, setSelectedChordId] = useState<string>("");

  const chordIntervals: Record<ChordType, number[]> = {
    maj: [0, 4, 7],
    min: [0, 3, 7],
    dim: [0, 3, 6],
    aug: [0, 4, 8],
    maj7: [0, 4, 7, 11],
    m7: [0, 3, 7, 10],
    dom7: [0, 4, 7, 10],
    maj9: [0, 4, 7, 11, 14],
    m9: [0, 3, 7, 10, 14],
    dom9: [0, 4, 7, 10, 14],
    maj11: [0, 4, 7, 11, 14, 17],
    m11: [0, 3, 7, 10, 14, 17],
    dom11: [0, 4, 7, 10, 14, 17],
    maj13: [0, 4, 7, 11, 14, 17, 21],
    m13: [0, 3, 7, 10, 14, 17, 21],
    dom13: [0, 4, 7, 10, 14, 17, 21],
  };

  const handleChordClick = (chord: ChordType) => {
    setCurrentChord(chord.notes);
    setSelectedChordId(chord.id);
  };

  const playNote = (note: string) => {
    setCurrentNote(note);
    setCurrentChord([note]);
  }

  function getChord(note: string, type: ChordType): string[] {
    const base = Tone.Frequency(note);
    return chordIntervals[type].map(i => base.transpose(i).toNote());
  }

  function invertChord(notes: string[], inversion: number): string[] {
    const result = [...notes];
    for (let i = 0; i < inversion; i++) {
      const note = result.shift();
      if (note) {
        const octaveUp = Tone.Frequency(note).transpose(12).toNote();
        result.push(octaveUp);
      }
    }
    return result;
  }

  const chords = [
    { id: "cmaj", name: "C major: C E G", notes: getChord("C4", "maj") },
    { id: "cmaj_first", name: "C major (1st inversion): E G C", notes: invertChord(getChord("C4", "maj"), 1) },
    { id: "cmaj_second", name: "C major (2nd inversion): G E C", notes: invertChord(getChord("C4", "maj"), 2) },

    { id: "cmin", name: "C minor (m): C D# G", notes: getChord("C4", "min") },
    { id: "cmin_first", name: "C minor (m) (1st inversion): D# G C", notes: invertChord(getChord("C4", "min"), 1) },
    { id: "cmin_second", name: "C minor (m) (2nd inversion): G C D", notes: invertChord(getChord("C4", "min"), 2) },

    { id: "cdim", name: "C diminished (dim): C D# F#", notes: getChord("C4", "dim") },
    { id: "cdim_first", name: "C diminished (dim) (1st inversion): D# F# C", notes: invertChord(getChord("C4", "dim"), 1) },
    { id: "cdim_second", name: "C diminished (dim) (2nd inversion): F# C D", notes: invertChord(getChord("C4", "dim"), 2) },

    { id: "caug", name: "C augmented (aug): C E G#", notes: getChord("C4", "aug") },
    { id: "caug_first", name: "C augmented (aug) (1st inversion): E G# C", notes: invertChord(getChord("C4", "aug"), 1) },
    { id: "caug_second", name: "C augmented (aug) (2nd inversion): G# C E", notes: invertChord(getChord("C4", "aug"), 2) },

    { id: "cmaj7", name: "C major seventh (maj7): C E G B", notes: getChord("C4", "maj7") },
    { id: "cmaj7_first", name: "C major seventh (maj7) (1st inversion): C E G B", notes: invertChord(getChord("C4", "maj7"), 1) },
    { id: "cmaj7_second", name: "C major seventh (maj7) (2nd inversion): C E G B", notes: invertChord(getChord("C4", "maj7"), 2) },
    { id: "cmaj7_third", name: "C major seventh (maj7) (3rd inversion): C E G B", notes: invertChord(getChord("C4", "maj7"), 3) },

    { id: "cmin7", name: "C minor seventh (m7): C D# G A#", notes: getChord("C4", "m7") },
    { id: "cmin7_first", name: "C minor seventh (m7) (1st inversion): C D# G A#", notes: invertChord(getChord("C4", "m7"), 1) },
    { id: "cmin7_second", name: "C minor seventh (m7) (2nd inversion): C D# G A#", notes: invertChord(getChord("C4", "m7"), 2) },
    { id: "cmin7_third", name: "C minor seventh (m7) (3rd inversion): C D# G A#", notes: invertChord(getChord("C4", "m7"), 3) },

    { id: "cdom7", name: "C dominant seventh (7): C E G A#", notes: getChord("C4", "dom7") },
    { id: "cdom7_first", name: "C dominant seventh (7) (1st inversion): C E G A#", notes: invertChord(getChord("C4", "dom7"), 1) },
    { id: "cdom7_second", name: "C dominant seventh (7) (2nd inversion): C E G A#", notes: invertChord(getChord("C4", "dom7"), 2) },

    { id: "cmaj9", name: "C major ninth (maj9): C E G B D", notes: getChord("C4", "maj9") },
    { id: "cmaj9_first", name: "C major ninth (maj9) (1st inversion): C E G B D", notes: invertChord(getChord("C4", "maj9"), 1) },
    { id: "cmaj9_second", name: "C major ninth (maj9) (2nd inversion): C E G B D", notes: invertChord(getChord("C4", "maj9"), 2) },
    { id: "cmaj9_third", name: "C major ninth (maj9) (3rd inversion): C E G B D", notes: invertChord(getChord("C4", "maj9"), 3) },

    { id: "cmin9", name: "C minor ninth (m9): C D# G A# C", notes: getChord("C4", "m9") },
    { id: "cmin9_first", name: "C minor ninth (m9) (1st inversion): C D# G A# C", notes: invertChord(getChord("C4", "m9"), 1) },
    { id: "cmin9_second", name: "C minor ninth (m9) (2nd inversion): C D# G A# C", notes: invertChord(getChord("C4", "m9"), 2) },
    { id: "cmin9_third", name: "C minor ninth (m9) (3rd inversion): C D# G A# C", notes: invertChord(getChord("C4", "m9"), 3) },

    { id: "cdom9", name: "C dominant ninth (dom9): C E G B D", notes: getChord("C4", "dom9") },
    { id: "cdom9_first", name: "C dominant ninth (dom9) (1st inversion): C E G B D", notes: invertChord(getChord("C4", "dom9"), 1) },
    { id: "cdom9_second", name: "C dominant ninth (dom9) (2nd inversion): C E G B D", notes: invertChord(getChord("C4", "dom9"), 2) },
    { id: "cdom9_third", name: "C dominant ninth (dom9) (3rd inversion): C E G B D", notes: invertChord(getChord("C4", "dom9"), 3) },

    { id: "cmaj11", name: "C major eleventh (maj11): C E G B D F#", notes: getChord("C4", "maj11") },
    { id: "cmaj11_first", name: "C major eleventh (maj11) (1st inversion): C E G B D F#", notes: invertChord(getChord("C4", "maj11"), 1) },
    { id: "cmaj11_second", name: "C major eleventh (maj11) (2nd inversion): C E G B D F#", notes: invertChord(getChord("C4", "maj11"), 2) },
    { id: "cmaj11_third", name: "C major eleventh (maj11) (3rd inversion): C E G B D F#", notes: invertChord(getChord("C4", "maj11"), 3) },

    { id: "cmin11", name: "C minor eleventh (m11): C D# G A# C E", notes: getChord("C4", "m11") },
    { id: "cmin11_first", name: "C minor eleventh (m11) (1st inversion): C D# G A# C E", notes: invertChord(getChord("C4", "m11"), 1) },
    { id: "cmin11_second", name: "C minor eleventh (m11) (2nd inversion): C D# G A# C E", notes: invertChord(getChord("C4", "m11"), 2) },
    { id: "cmin11_third", name: "C minor eleventh (m11) (3rd inversion): C D# G A# C E", notes: invertChord(getChord("C4", "m11"), 3) },

    { id: "cdom11", name: "C dominant eleventh (dom11): C E G B D F# A#", notes: getChord("C4", "dom11") },
    { id: "cdom11_first", name: "C dominant eleventh (dom11) (1st inversion): C E G B D F# A#", notes: invertChord(getChord("C4", "dom11"), 1) },
    { id: "cdom11_second", name: "C dominant eleventh (dom11) (2nd inversion): C E G B D F# A#", notes: invertChord(getChord("C4", "dom11"), 2) },
    { id: "cdom11_third", name: "C dominant eleventh (dom11) (3rd inversion): C E G B D F# A#", notes: invertChord(getChord("C4", "dom11"), 3) },

    { id: "cmaj13", name: "C major thirteenth (maj13): C E G B D F# A# C", notes: getChord("C4", "maj13") },
    { id: "cmaj13_first", name: "C major thirteenth (maj13) (1st inversion): C E G B D F# A# C", notes: invertChord(getChord("C4", "maj13"), 1) },
    { id: "cmaj13_second", name: "C major thirteenth (maj13) (2nd inversion): C E G B D F# A# C", notes: invertChord(getChord("C4", "maj13"), 2) },
    { id: "cmaj13_third", name: "C major thirteenth (maj13) (3rd inversion): C E G B D F# A# C", notes: invertChord(getChord("C4", "maj13"), 3) },

    { id: "cmin13", name: "C minor thirteenth (m13): C D# G A# C E G", notes: getChord("C4", "m13") },
    { id: "cmin13_first", name: "C minor thirteenth (m13) (1st inversion): C D# G A# C E G", notes: invertChord(getChord("C4", "m13"), 1) },
    { id: "cmin13_second", name: "C minor thirteenth (m13) (2nd inversion): C D# G A# C E G", notes: invertChord(getChord("C4", "m13"), 2) },
    { id: "cmin13_third", name: "C minor thirteenth (m13) (3rd inversion): C D# G A# C E G", notes: invertChord(getChord("C4", "m13"), 3) },

    { id: "cdom13", name: "C dominant thirteenth (dom13): C E G B D F# A# C E", notes: getChord("C4", "dom13") },
    { id: "cdom13_first", name: "C dominant thirteenth (dom13) (1st inversion): C E G B D F# A# C E", notes: invertChord(getChord("C4", "dom13"), 1) },
    { id: "cdom13_second", name: "C dominant thirteenth (dom13) (2nd inversion): C E G B D F# A# C E", notes: invertChord(getChord("C4", "dom13"), 2) },
    { id: "cdom13_third", name: "C dominant thirteenth (dom13) (3rd inversion): C E G B D F# A# C E", notes: invertChord(getChord("C4", "dom13"), 3) },
  ];

  return (
    <>
      <PianoBase octaves={octaves} showChordOnThePiano={currentChord} />

      <ul className="chord-list">
        {chords.map(chord => (
          <li key={chord.id}>
            <button
              onClick={() => handleChordClick(chord)}
              className={selectedChordId === chord.id ? 'chord-button selected' : 'chord-button'}
            >
              {chord.name}
            </button>
          </li>
        ))}
      </ul>

      {/* falta tonos inversiones */}
    </>
  );
}