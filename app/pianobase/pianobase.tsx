import * as Tone from "tone";
import React, { useState, useEffect, useRef } from "react";
import { Button, DropdownMenu } from "@radix-ui/themes";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import type { PianoBaseProps, chordMapType, OctaveRangeType } from "./PianoBase.types";

import './PianoBase.css';

const defaultChordMap: chordMapType = {
  Dmaj_4: ["D4", "A4", "F#5", "A5", "D6"],
  Emin_4: ["E4", "B4", "G5", "B5", "E6"],
  Gbmin_4: ["F#4", "C#5", "A5", "C#6", "F#6"],
  Gmaj_4: ["G4", "D5", "B5", "D6", "G6"],
  Amaj_4: ["A4", "E5", "C#6", "E6", "A6"],
  Bmin_4: ["B4", "F#5", "D6", "F#6", "B6"],
  Cdim_4: ["C#5", "G5", "E6", "G6", "C#7"],

  Dmaj_5: ["D5", "A5", "F#6", "A6", "D7"],
};

const generateNotes = function (octaves: OctaveRangeType = 3, startOctave: OctaveRangeType = 4) {
  const white = [];
  const black = [];

  for (let i = 0; i < octaves; i++) {
    const currentOctave = startOctave + i;
    white.push(...["C", "D", "E", "F", "G", "A", "B"].map(n => `${n}${currentOctave}`));
    black.push(...["C#", "D#", "F#", "G#", "A#"].map(n => `${n}${currentOctave}`));
  }

  // Agrega la nota final del último do (ej. C6)
  white.push(`C${startOctave + octaves}`);

  return { white, black };
}

function getBlackKeyWidth(octaves: OctaveRangeType): string {
  if (octaves <= 1) return "7%";
  if (octaves === 2) return "4%";
  if (octaves === 3) return "3%";
  if (octaves === 4) return "2%";
  return "1.4%";
}

function createDefaultSynth() {
  // Sintetizador principal para el tono del piano
  const synth = new Tone.PolySynth(Tone.Synth, {
    volume: -8,
    envelope: {
      attack: 0.002,    // Ataque muy rápido para el golpe de martillo
      decay: 0.5,       // Decay moderado
      sustain: 0.15,    // Sustain bajo para simular las cuerdas del piano
      release: 1.5      // Release largo para la resonancia natural
    },
    oscillator: {
      type: "sine"      // Onda sinusoidal para un tono más puro
    }
  });

  // Filtro para dar forma al sonido del piano
  const filter = new Tone.Filter({
    type: "lowpass",
    frequency: 5000,    // Frecuencia de corte alta para mantener brillo
    Q: 1               // Resonancia suave
  });

  // Compressor para controlar la dinámica
  const compressor = new Tone.Compressor({
    threshold: -20,
    ratio: 3,
    attack: 0.003,
    release: 0.25
  });

  // Reverb sutil para simular la caja de resonancia del piano
  const reverb = new Tone.Reverb({
    decay: 1.5,        // Decay moderado
    wet: 0.2          // Mezcla sutil
  }).toDestination();

  // Conectamos la cadena de efectos
  synth.chain(filter, compressor, reverb);

  // Retornamos un objeto compatible con la interfaz esperada
  return {
    triggerAttackRelease(note: string, duration: string | number) {
      synth.triggerAttackRelease(note, duration);
    },
    dispose() {
      synth.dispose();
      filter.dispose();
      compressor.dispose();
      reverb.dispose();
    }
  } as unknown as Tone.PolySynth;
}

export default function PianoBase({
  createSynth,
  chordMap = defaultChordMap,
  octaves = 3,
  showChordOnThePiano
}: PianoBaseProps) {
  const synthRef = useRef<Tone.Synth | Tone.DuoSynth | Tone.PolySynth | null>(null);
  const [activeNotes, setActiveNotes] = useState<string[]>([]);
  const [highlightedKeys, setHighlightedKeys] = useState<string[]>([]);
  const [showChords, setShowChords] = useState(false);
  const { white, black } = generateNotes(octaves);

  const sharpToFlatMap: Record<string, string> = {
    "C#": "Db",
    "D#": "Eb",
    "F#": "Gb",
    "G#": "Ab",
    "A#": "Bb"
  };

  const getAlternativeNotation = (note: string): string => {
    const [, noteName, octave] = note.match(/([A-G]#)(\d)/) || [];
    if (noteName && sharpToFlatMap[noteName]) {
      return `${sharpToFlatMap[noteName]}${octave}`;
    }
    return "";
  };

  useEffect(() => {
    const synth = createSynth
      ? createSynth()
      : createDefaultSynth();

    synthRef.current = synth;  // Asignar el sintetizador al ref

    return () => {
      synth.dispose();
      synthRef.current = null;
    };
  }, [createSynth]);

  useEffect(() => {
    if (showChordOnThePiano && showChordOnThePiano.length > 0) {
      setHighlightedKeys(showChordOnThePiano);
      playChord(showChordOnThePiano);
    }
  }, [showChordOnThePiano]);

  const playNote = (note: string) => {
    setActiveNotes([note]);
    synthRef.current?.triggerAttackRelease(note, "4n");
    setTimeout(() => setActiveNotes([]), 180);
  };

  const playChord = (notes: string[]) => {
    setActiveNotes(notes);
    notes.forEach(note => synthRef.current?.triggerAttackRelease(note, "2n"));
    setTimeout(() => setActiveNotes([]), 180);
  };

  const playSequence = (notesOrName: string[] | string, delay = 200) => {
    const notes = Array.isArray(notesOrName)
      ? notesOrName
      : chordMap[notesOrName] || [];

    if (notes.length === 0) return;

    setActiveNotes(notes);

    notes.forEach((note, i) => {
      setTimeout(() => {
        synthRef.current?.triggerAttackRelease(note, "8n");
        setActiveNotes([note]);
      }, i * delay);
    });
    setTimeout(() => setActiveNotes([]), notes.length * delay + 180);
  };

  const getBlackKeyLeft = (note: string, whiteNotes: string[]) => {
    const blackToWhiteBefore: Record<string, string> = {
      "C#": "C",
      "D#": "D",
      "F#": "F",
      "G#": "G",
      "A#": "A",
    };

    const match = note.match(/^([A-G]#)(\d)$/);
    if (!match) return "0%";

    const [_, pitchClass, octave] = match;
    const whiteBefore = `${blackToWhiteBefore[pitchClass]}${octave}`;
    const whiteIndex = whiteNotes.indexOf(whiteBefore);

    if (whiteIndex === -1) return "0%";

    const whiteKeyWidth = 100 / whiteNotes.length;
    const left = (whiteIndex + 1) * whiteKeyWidth;

    return `${left}%`; // ya está centrado por transform: translateX(-50%)
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
                  onClick={() => playSequence(chordName)}
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
          onClick={() => playSequence(chordName)}
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
              onClick={() => playNote(note)}
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
              onClick={() => playNote(note)}
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