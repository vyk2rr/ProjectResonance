import * as Tone from "tone";
import React, { useState, useEffect, useRef } from "react";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import {
  DEFAULT_CHORD_MAP,
  generateNotes,
  getAlternativeNotation,
  getBlackKeyLeft,
  getBlackKeyWidth,
  createDefaultSynth,
  playNote,
  playChord,
  playChordSimultaneous
} from "./PianoBase.utils";
import type {
  tChord, tOctaveRange, tChordSequence,
  tChordMap, SupportedSynthType,
  tNoteWithOctave, tNoteWOCtaveQuality,
  tSequenceToPlayProps, tTime, tNoteName
} from "./PianoBase.types";

import './PianoBase.css';

export interface PianoBaseProps {
  createSynth?: () => SupportedSynthType;
  chordMap?: tChordMap;
  octave?: tOctaveRange;
  octaves?: tOctaveRange;
  highlightOnThePiano?: tChord;
  sequenceToPlay?: tSequenceToPlayProps;
}

export default function PianoBase({
  createSynth,
  chordMap = DEFAULT_CHORD_MAP,
  octave = 4,
  octaves = 3,
  highlightOnThePiano,
  sequenceToPlay
}: PianoBaseProps) {
  const synthRef = useRef<SupportedSynthType | null>(null);
  const [activeNotes, setActiveNotes] = useState<tChord>([]);
  const [highlightedKeys, setHighlightedKeys] = useState<tChord>([]);
  const [showChords, setShowChords] = useState(false);
  const { white, black } = generateNotes(octaves, octave);

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
      playChordSimultaneous(highlightOnThePiano, synthRef.current);
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

  const handlePlaySequenceFromChordMap = async (chordName: tNoteWOCtaveQuality) => {
    const chord = chordMap[chordName] || [];
    if (chord.length === 0) return;

    for (const note of chord) {
      await playNoteWithHighlight(note, true, undefined, "13n");
    }

    setActiveNotes([]);
  };

  const handlePianoKeyClick = (note: tNoteWithOctave) => {
    setActiveNotes([note]);
    playNote(note, synthRef.current);
    setTimeout(() => setActiveNotes([]), 180);
  };

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
            >{highlightedKeys.includes(note) && <span className="note-name">{note}</span>}</div>
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
}