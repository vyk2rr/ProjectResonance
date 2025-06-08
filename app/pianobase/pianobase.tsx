import * as Tone from "tone";
import React, { useState, useEffect, useRef } from "react";
import { Button, DropdownMenu } from "@radix-ui/themes";
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
  tSequenceToPlayProps, tTime
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
    if (highlightOnThePiano && highlightOnThePiano.length > 0) {
      setHighlightedKeys(highlightOnThePiano);
      playChordSimultaneous(highlightOnThePiano, synthRef.current);
    }
  }, [highlightOnThePiano]);

  useEffect(() => {
    if (!sequenceToPlay?.sequenceToPlay || sequenceToPlay.sequenceToPlay.length === 0) return;

    let cancelled = false;
    const runSequence = async () => {
      await handlePlaySequenceWithHighlight(sequenceToPlay.sequenceToPlay, () => cancelled);
    };
    runSequence();

    return () => { cancelled = true; };
  }, [sequenceToPlay]);

  async function playNoteWithHighlight(
    note: tNoteWithOctave,
    isCancelled?: () => boolean,
    duration?: tTime
  ) {
    if (isCancelled?.()) return;
    if (sequenceToPlay?.hihlightedKeys) setActiveNotes([note]);
    await playNote(note, synthRef.current, duration);
    setActiveNotes([]);
  }

  const handlePlaySequenceWithHighlight = async (
    sequence: tChordSequence,
    isCancelled?: () => boolean
  ) => {
    if (!sequence || sequence.length === 0) return;

    for (const chord of sequence) {
      for (const note of chord) {
        await playNoteWithHighlight(note, isCancelled);
      }
    }

    sequenceToPlay?.onSequenceEnd();
  };

  const handlePlaySequenceFromChordMap = async (chordName: tNoteWOCtaveQuality) => {
    const chord = chordMap[chordName] || [];
    if (chord.length === 0) return;

    for (const note of chord) {
      await playNoteWithHighlight(note, undefined, "13n");
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
      {Object.keys(chordMap).length > 0 && (<DropdownMenu.Root >
        <DropdownMenu.Trigger>
          <Button className="IconButton" aria-label="Customise options" variant='classic' color='jade' size='1' radius='full'>
            <HamburgerMenuIcon />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item color='orange' onClick={() => setShowChords(!showChords)}>show D Major buttons</DropdownMenu.Item>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>Play a D major Chord</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              {Object.entries(chordMap).map(([chordName], i) => (
                <DropdownMenu.Item
                  key={chordName}
                  onClick={() => handlePlaySequenceFromChordMap(chordName as tNoteWOCtaveQuality)}
                  color={["orange", "yellow", "green", "blue", "indigo", "purple", "red"][i % 7]}
                >
                  Play {chordName}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
        </DropdownMenu.Content>
      </DropdownMenu.Root>)}

      {showChords && Object.entries(chordMap).map(([chordName], i) => (
        <Button
          key={chordName}
          onClick={() => handlePlaySequenceFromChordMap(chordName as tNoteWOCtaveQuality)}
          variant="classic"
          color={["orange", "yellow", "green", "blue", "indigo", "purple", "red"][i % 7]}
        >
          {chordName}
        </Button>
      ))}

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