import * as Tone from "tone";
import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import {
  generateNotes,
  getAlternativeNotation,
  getBlackKeyLeft,
  getBlackKeyWidth,
  createDefaultSynth
} from "./PianoBase.utils";
import type {
  tChord, tOctaveRange,
  SupportedSynthType,
  tNoteWithOctave,
  tTime, 
  tChordSequence,
  tSequenceToPlayProps
} from "./PianoBase.types";
import { PianoObserver } from "../PianoObserver/PianoObserver"; // Asumiendo que existe y se usa
import './PianoBase.css';
import type { iChordEvent } from "../ChordDispatcher/ChordDispatcher";

interface iActiveNoteInfo {
  note: tNoteWithOctave;
  releaseTime: number; // performance.now() + duration en ms
  highlightGroup?: 1 | 2;
}

export interface PianoBaseProps {
  createSynth?: () => SupportedSynthType;
  octave?: tOctaveRange;
  octaves?: tOctaveRange;
  highlightOnThePiano?: tChord;
  sequenceToPlay?: tSequenceToPlayProps;
  pianoObservable?: PianoObserver;
}

export type PianoBaseHandle = {
  triggerChordEvent: (event: iChordEvent) => void;
};

const PianoBase = forwardRef<PianoBaseHandle, PianoBaseProps>(({
  createSynth,
  octave = 4,
  octaves = 3,
  highlightOnThePiano,
  sequenceToPlay,
  pianoObservable,
}, ref) => {
  const synthRef = useRef<SupportedSynthType | null>(null);

  // Estados para highlights
  const [clickedNotes, setClickedNotes] = useState<iActiveNoteInfo[]>([]);
  const [highlightedKeysGroup1, setHighlightedKeysGroup1] = useState<iActiveNoteInfo[]>([]);
  const [highlightedKeysGroup2, setHighlightedKeysGroup2] = useState<iActiveNoteInfo[]>([]);
  const [highlightedKeysLegacy, setHighlightedKeysLegacy] = useState<tChord>([]);

  const { white, black } = generateNotes(octaves, octave);
  const visualHighlightBufferMs = 50;

  useEffect(() => {
    const synth = createSynth ? createSynth() : createDefaultSynth();
    synthRef.current = synth;
    return () => {
      synthRef.current?.dispose();
      synthRef.current = null;
    };
  }, [createSynth]);

  // Limpieza de highlights por tiempo
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = performance.now();
      setClickedNotes(prev => prev.filter(n => n.releaseTime > now));
      setHighlightedKeysGroup1(prev => prev.filter(k => k.releaseTime > now));
      setHighlightedKeysGroup2(prev => prev.filter(k => k.releaseTime > now));
    }, 30);
    return () => clearInterval(intervalId);
  }, []);

  // --- HIGHLIGHT LEGACY ---
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

  const playChordSimultaneous = async function (
    notes: tChord,
    synth: SupportedSynthType,
    duration: tTime = "2n"
  ) {
    await Promise.all(notes.map(note => playNote(note, synth, duration)));
  }

  useEffect(() => {
    if (highlightOnThePiano && highlightOnThePiano.length > 0 && synthRef.current) {
      playChordSimultaneous(highlightOnThePiano, synthRef.current);
      setHighlightedKeysLegacy(highlightOnThePiano);
    } else {
      setHighlightedKeysLegacy([]);
    }
  }, [highlightOnThePiano]);
  // --- SEQUENCE LEGACY ---

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

  async function playNoteWithHighlight(
    note: tNoteWithOctave,
    highlight: boolean = true,
    isCancelled?: () => boolean,
    duration?: tTime
  ) {
    if (isCancelled?.()) return;
    if (highlight) setClickedNotes([{ note, releaseTime: performance.now() + 180 }]);
    await playNote(note, synthRef.current, duration);
    setClickedNotes([]);
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

  const triggerChordEvent = (event: iChordEvent) => {
    if (!synthRef.current) return;
    const { pitches, duration, velocity, highlightGroup, scheduledPlayTime } = event;
    const noteToPlay = pitches[0];
    if (!noteToPlay) return;
    synthRef.current.triggerAttackRelease(noteToPlay, duration, scheduledPlayTime, velocity);
    pianoObservable?.notify({ type: "chordPlayed", chord: [noteToPlay] });
    const visualDurationMs = Tone.Time(duration).toMilliseconds() + visualHighlightBufferMs;
    const newHighlightEntry: iActiveNoteInfo = {
      note: noteToPlay,
      releaseTime: performance.now() + visualDurationMs,
      highlightGroup: highlightGroup
    };
    if (highlightGroup === 1) {
      setHighlightedKeysGroup1(prev => [...prev, newHighlightEntry]);
    } else if (highlightGroup === 2) {
      setHighlightedKeysGroup2(prev => [...prev, newHighlightEntry]);
    }
  };

  useImperativeHandle(ref, () => ({
    triggerChordEvent,
  }));

  const isNoteClicked = (note: tNoteWithOctave) => clickedNotes.some(cn => cn.note === note);
  const isNoteInGroup1 = (note: tNoteWithOctave) => highlightedKeysGroup1.some(hk => hk.note === note);
  const isNoteInGroup2 = (note: tNoteWithOctave) => highlightedKeysGroup2.some(hk => hk.note === note);
  const isNoteLegacy = (note: tNoteWithOctave) => highlightedKeysLegacy.includes(note);

  const handlePianoKeyClick = (note: tNoteWithOctave) => {
    setClickedNotes([{ note, releaseTime: performance.now() + 180 }]);
    playNote(note, synthRef.current);
    pianoObservable?.notify({ type: "notePlayed", note });
    setTimeout(() => setClickedNotes([]), 180);
  };

  return (
    <div className="piano-base">
      <div className="piano">
        <div className="white-keys">
          {white.map(note => {
            const clicked = isNoteClicked(note);
            const group1 = isNoteInGroup1(note);
            const group2 = isNoteInGroup2(note);
            const legacy = isNoteLegacy(note);
            return (
              <div
                key={note}
                className={`
                  white-key
                  ${(clicked || group1 || group2 || legacy) ? "active-key" : ""}
                  ${group1 ? "highlight-group-1" : ""}
                  ${group2 ? "highlight-group-2" : ""}
                  ${legacy ? "highlight-legacy" : ""}
                `}
                data-note={note}
                onClick={() => handlePianoKeyClick(note)}
              >
                {(group1 || group2 || legacy || note.startsWith('C')) && <span className="note-name">{note}</span>}
              </div>
            );
          })}
        </div>
        <div className="black-keys">
          {black.map(noteString => {
            const clicked = isNoteClicked(noteString);
            const group1 = isNoteInGroup1(noteString);
            const group2 = isNoteInGroup2(noteString);
            const legacy = isNoteLegacy(noteString);
            return (
              <div
                key={noteString}
                className={`
                  black-key
                  ${(clicked || group1 || group2 || legacy) ? "active-key" : ""}
                  ${group1 ? "highlight-group-1" : ""}
                  ${group2 ? "highlight-group-2" : ""}
                  ${legacy ? "highlight-legacy" : ""}
                `}
                style={{
                  pointerEvents: "all",
                  left: getBlackKeyLeft(noteString, white),
                  width: getBlackKeyWidth(octaves)
                }}
                data-note={noteString}
                onClick={() => handlePianoKeyClick(noteString)}
              >
                {(group1 || group2 || legacy) && (
                  <span className="note-name">
                    <span className="flat-notation">{getAlternativeNotation(noteString)}</span>
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default PianoBase;