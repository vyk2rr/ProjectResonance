import * as Tone from "tone";
import React, { useState, useEffect, useRef } from "react";
import { Button, DropdownMenu } from "@radix-ui/themes";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import {
  defaultChordMap,
  generateNotes,
  getAlternativeNotation,
  getBlackKeyLeft,
  getBlackKeyWidth,
  createDefaultSynth,
  playNote,
  playChord,
  playSequence,
} from "./PianoBase.utils";
import type { PianoBaseProps, tChord } from "./PianoBase.types";

import './PianoBase.css';

export interface PianoBaseProps {
  createSynth?: () => SupportedSynthType;
  chordMap?: ChordMap;
  octave?: tOctaveRange;
  octaves?: tOctaveRange;
  hightlightOnThePiano?: tChord;
  playitOnThePiano?: tChord;
  sequenceToPlay?: tChord[];
  onSequenceEnd?: () => void;
}

export default function PianoBase({
  createSynth,
  chordMap = defaultChordMap,
  octave = 4,
  octaves = 3,
  hightlightOnThePiano,
  playitOnThePiano,
}: PianoBaseProps) {
  const synthRef = useRef<Tone.Synth | Tone.DuoSynth | Tone.PolySynth | null>(null);
  const [activeNotes, setActiveNotes] = useState<string[]>([]);
  const [highlightedKeys, setHighlightedKeys] = useState<string[]>([]);
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
  }, [createSynth]);

  useEffect(() => {
    if (hightlightOnThePiano && hightlightOnThePiano.length > 0) {
      setHighlightedKeys(hightlightOnThePiano);
      // playChord(hightlightOnThePiano, synthRef.current);
    }
  }, [hightlightOnThePiano]);

  useEffect(() => {
    if (hightlightOnThePiano && hightlightOnThePiano.length > 0) {
      playChord(hightlightOnThePiano, synthRef.current);
    }
  }, [playitOnThePiano]);{

  const handlePlayNote = (note: string) => {
    setActiveNotes([note]);
    playNote(note, synthRef.current);
    setTimeout(() => setActiveNotes([]), 180);
  };

  // const handlePlayChord = (notes: string[]) => {
  //   setActiveNotes(notes);
  //   playChord(notes, synthRef.current);
  //   setTimeout(() => setActiveNotes([]), 180);
  // };

  const handlePlaySequence = (notesOrName: string[] | string) => {
    const notes = Array.isArray(notesOrName)
      ? notesOrName
      : chordMap[notesOrName] || [];

    if (notes.length === 0) return;

    setActiveNotes(notes);
    playSequence(notesOrName, synthRef.current, chordMap);
    setTimeout(() => setActiveNotes([]), notes.length * 200 + 180);
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
                  onClick={() => handlePlaySequence(chordName)}
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
          onClick={() => handlePlaySequence(chordName)}
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
              onClick={() => handlePlayNote(note)}
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
              onClick={() => handlePlayNote(note)}
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