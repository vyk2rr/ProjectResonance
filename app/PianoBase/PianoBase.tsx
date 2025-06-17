import * as Tone from "tone";
import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import {
  // DEFAULT_CHORD_MAP,
  generateNotes,
  getAlternativeNotation,
  getBlackKeyLeft,
  getBlackKeyWidth,
  createDefaultSynth,
  // playNote,
  // playChord,
  // playChordSimultaneous
} from "./PianoBase.utils";
import type {
  tChord, tOctaveRange, tChordSequence,
  // tChordMap,
  SupportedSynthType,
  tNoteWithOctave,
  // tNoteWOCtaveQuality,
  tSequenceToPlayProps, tTime,
  // tNoteName
} from "./PianoBase.types";
import { PianoObserver } from "../PianoObserver/PianoObserver";
import './PianoBase.css';
import { iChordDispatcher } from "../ChordDispatcher/ChordDispatcher";
import type { iChordEvent } from "../ChordDispatcher/ChordDispatcher";

export interface PianoBaseProps {
  createSynth?: () => SupportedSynthType;
  // chordMap?: tChordMap;
  octave?: tOctaveRange;
  octaves?: tOctaveRange;
  highlightOnThePiano?: tChord;
  sequenceToPlay?: tSequenceToPlayProps;
  pianoObservable?: PianoObserver;
  chordDispatcherList?: iChordDispatcher[];
}

export type PianoBaseHandle = {
  triggerChordEvent: (event: iChordEvent) => void;
}

const PianoBase = forwardRef<PianoBaseHandle, PianoBaseProps>(({
  createSynth,
  // chordMap = DEFAULT_CHORD_MAP,
  octave = 4,
  octaves = 3,
  highlightOnThePiano,
  sequenceToPlay,
  pianoObservable,
  chordDispatcherList,
}, ref) => {
  const synthRef = useRef<SupportedSynthType | null>(null);
  const [activeNotes, setActiveNotes] = useState<tChord>([]);
  const [highlightedKeys, setHighlightedKeys] = useState<tChord>([]);
  const { white, black } = generateNotes(octaves, octave);

  const playNote = function (
    note: tNoteWithOctave,
    synth: SupportedSynthType | null,
    duration: tTime = "4n"
  ): Promise<void> {
    if (!synth) return Promise.resolve();
    synth.triggerAttackRelease(note, duration);
    const ms = Tone.Time(duration).toMilliseconds();
    return new Promise(res => setTimeout(res, ms));
  }

  const playChord = async function (
    notes: tChord,
    synth: SupportedSynthType | null,
    duration: tTime = "4n"
  ): Promise<void> {
    if (!synth) return;
    await Promise.all(notes.map(note => playNote(note, synth, duration)));
    for (const note of notes) {
      await playNote(note, synth, duration);
    }
  }

  const playChordSimultaneous = async function (
    notes: tChord,
    synth: SupportedSynthType,
    duration: tTime = "2n"
  ) {
    await Promise.all(notes.map(note => playNote(note, synth, duration)));
  }

  useEffect(() => {
    const synth = createSynth
      ? createSynth()
      : createDefaultSynth();

    synthRef.current = synth;

    return () => {
      synth.dispose();
      synthRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (highlightOnThePiano && highlightOnThePiano.length > 0 && synthRef.current) {
      setHighlightedKeys(highlightOnThePiano);
    }
  }, [highlightOnThePiano]);

  useEffect(() => {
    if (!sequenceToPlay?.sequenceToPlay || sequenceToPlay.sequenceToPlay.length === 0) return;

    let cancelled = false;
    const runSequence = async () => {
      await handlePlaySequenceWithHighlight(
        sequenceToPlay.sequenceToPlay,
        sequenceToPlay.highlightedKeys,
        () => cancelled);
    };
    runSequence();

    return () => { cancelled = true; };
  }, [sequenceToPlay]);

  useEffect(() => {
    if (!chordDispatcherList || chordDispatcherList.length === 0) return;

    chordDispatcherList.forEach(dispatcher => {
      dispatcher.events.forEach(event => {
        dispatcher.triggerNote(event);  // Solo console.log (por ahora)
      });
    });
  }, [chordDispatcherList]);

  async function playNoteWithHighlight(
    note: tNoteWithOctave,
    highlight: boolean = true,
    isCancelled?: () => boolean,
    duration?: tTime
  ) {
    if (isCancelled?.()) return;

    if (highlight) setActiveNotes([note]);

    await playNote(note, synthRef.current, duration);
    setActiveNotes([]);
  }

  const handlePlaySequenceWithHighlight = async (
    sequence: tChordSequence,
    highlight?: boolean,
    isCancelled?: () => boolean
  ) => {
    if (!sequence || sequence.length === 0) return;

    for (const chord of sequence) {
      for (const note of chord) {
        await playNoteWithHighlight(note, highlight, isCancelled);
      }
    }

    sequenceToPlay?.onSequenceEnd();
  };

  const handlePianoKeyClick = (note: tNoteWithOctave) => {
    setActiveNotes([note]);
    playNote(note, synthRef.current);
    pianoObservable?.notify({ type: "notePlayed", note });
    setTimeout(() => setActiveNotes([]), 180);
  };

  const triggerChordEvent = (event: iChordEvent) => {
    if (!synthRef.current) {
      console.error("Synth not initialized in PianoBase");
      return;
    }

    const { pitches, duration, velocity } = event;
    const time = Tone.now() + 0.01;

    // Dispara todas las notas del acorde simultáneamente
    pitches.forEach(note => {
      synthRef.current?.triggerAttackRelease(note, duration, undefined, velocity);
    });
    pianoObservable?.notify({ type: "chordPlayed", chord: pitches });

    // Actualizar visualización de teclas activas/resaltadas
    setHighlightedKeys(pitches);
    setTimeout(() => {
      setHighlightedKeys([]);
    }, Tone.Time(duration).toMilliseconds() + 2000);
  };

  useImperativeHandle(ref, () => ({
    triggerChordEvent,
  }));

  return (
    <div className="piano-base">
      <div className="piano">
        <div className="white-keys">
          {white.map(note => (
            <div
              key={note}
              className={`white-key${activeNotes.includes(note) || highlightedKeys.includes(note) ? " active-key" : ""}`}
              data-note={note}
              onClick={() => handlePianoKeyClick(note)}
            >
              {highlightedKeys.includes(note) && <span className="note-name">{note}</span>}
              {note.startsWith('C') && <span className="note-name">{note}</span>}
            </div>
          ))}
        </div>
        <div className="black-keys">
          {black.map(note => (
            <div
              key={note}
              className={`black-key${activeNotes.includes(note) || highlightedKeys.includes(note) ? " active-key" : ""}`}
              style={{
                pointerEvents: "auto",
                left: getBlackKeyLeft(note, white),
                width: getBlackKeyWidth(octaves)
              }}
              data-note={note}
              onClick={() => handlePianoKeyClick(note)}
            >{highlightedKeys.includes(note) && <span className="note-name">
              <span className="flat-notation">{getAlternativeNotation(note)}</span>
              <span className="sharp-notation">{note}</span>
            </span>
              }</div>
          ))}
        </div>
      </div>
    </div>
  );
})

export default PianoBase;
