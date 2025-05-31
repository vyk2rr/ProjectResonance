import './pianobase.css';
import * as Tone from "tone";
import React, { useState, useEffect, useRef } from "react";
import { Button, DropdownMenu } from "@radix-ui/themes";


type PianoBaseProps = {
  createSynth?: () => Tone.Synth | Tone.DuoSynth;
  chordMap?: Record<string, string[]>;
  playChord: (notes: string[]) => void;
};

const defaultChordMap: Record<string, string[]> = {
  Dmaj_4: ["D4", "A4", "F#5", "A5", "D6"],
  Emin_4: ["E4", "B4", "G5", "B5", "E6"],
  Gbmin_4: ["F#4", "C#5", "A5", "C#6", "F#6"],
  Gmaj_4: ["G4", "D5", "B5", "D6", "G6"],
  Amaj_4: ["A4", "E5", "C#6", "E6", "A6"],
  Bmin_4: ["B4", "F#5", "D6", "F#6", "B6"],
  Cdim_4: ["C#5", "G5", "E6", "G6", "C#7"],

  Dmaj_5: ["D5", "A5", "F#6", "A6", "D7"],
};

export function PianoBase({ createSynth, chordMap = defaultChordMap }: PianoBaseProps) {
  const synthRef = useRef<Tone.Synth | Tone.DuoSynth | Tone.PolySynth | null>(null);
  const [activeNotes, setActiveNotes] = useState<string[]>([]);
  const [showChords, setShowChords] = useState(false);

  useEffect(() => {
    const synth = createSynth
      ? createSynth()
      : new Tone.PolySynth(Tone.Synth).toDestination();
    synthRef.current = synth;

    return () => {
      synth.dispose();
      synthRef.current = null;
    };
  }, [createSynth]);

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

  return (
    <div>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button variant="classic" size="2">
            Piano Options
            <DropdownMenu.TriggerIcon />
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
      </DropdownMenu.Root>

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
          {[
            "C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5",
            "D5", "E5", "F5", "G5", "A5", "B5", "C6", "D6"
          ].map(note => (
            <div
              key={note}
              className={`white-key${activeNotes.includes(note) ? " active-key" : ""}`}
              data-note={note}
              onClick={() => playNote(note)}
            />
          ))}
        </div>
        <div className="black-keys">
          {[
            "C#4", "D#4", "F#4", "G#4", "A#4",
            "C#5", "D#5", "F#5", "G#5", "A#5",
            "C#6"
          ].map(note => (
            <div
              key={note}
              className={`black-key${activeNotes.includes(note) ? " active-key" : ""}`}
              data-note={note}
              onClick={() => playNote(note)}
              style={{ pointerEvents: "auto" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}