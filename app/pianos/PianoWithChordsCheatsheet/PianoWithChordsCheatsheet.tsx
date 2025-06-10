import * as Tone from "tone";
import React, { useState } from "react";
import type { PianoBaseProps } from "../../PianoBase/PianoBase";
import type {
  tOctaveRange, tChord, tNote, tChordWithName,
} from "../../PianoBase/PianoBase.types";
import "./PianoWithChordsCheatsheet.css";
import { PianoDryLeaf } from "../PianoDryLeaf";
import { PianoMetalicoLaser } from "../PianoMetalicoLaser";
import PianoBase from "../../PianoBase/PianoBase";
import ChordPalette from "./../../ChordPalette/ChordPalette";
import { getChordColor } from "./../../ChordPalette/ChordPalette.utils";

interface PianoWithChordsHelperProps extends PianoBaseProps {
  chord: string[],
  octaves: tOctaveRange
}

export default function PianoWithChordsHelper({ chord, octaves = 2, octave = 4 }: PianoWithChordsHelperProps) {
  const [currentChord, setCurrentChord] = useState<tChord>([]);
  const [selectedChordId, setSelectedChordId] = useState<string>("");
  const [selectedNote, setSelectedNote] = useState<string>("C");
  const [selectedOctave, setSelectedOctave] = useState<tOctaveRange>(4);
  const [currentColor, setCurrentColor] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [showInversions, setShowInversions] = useState<boolean>(false);

  const notes: tNote[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

  const handleChordClick = (chord: tChordWithName) => {
    setCurrentChord(chord.chord);
    setCurrentColor(getChordColor(chord.rootNote, chord.quality));
    setSelectedChordId(chord.id);
  };

  return (
    <>
      <div style={{ backgroundColor: currentColor, padding: "10px" }}>
        <PianoMetalicoLaser
          octaves={octaves}
          octave={octave}
          highlightOnThePiano={currentChord}
        />
      </div>

      <ChordPalette
        params={{
          currentChord,
          setCurrentChord,
          currentColor,
          setCurrentColor,
          octave: selectedOctave
        }}
        showNotes
        showName
        debug={true}
      />
    </>
  );
}