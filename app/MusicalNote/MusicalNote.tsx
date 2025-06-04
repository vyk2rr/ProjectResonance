import React from "react";
import "./MusicalNote.css";

type MusicalNoteProps = {
    note: string;
    chord?: string[];
    active?: boolean;
    size?: "small" | "medium" | "large";

}

export default function MusicalNote({ note, active, size }: MusicalNoteProps) {
  const noteName = note.split("")[0];
  const noteOctave = note.split("")[1];
  const className = `musical-note ${size} ${active ? "active" : ""}`;

  return (
    <div className={className}>
      <div className="note-name">{noteName}</div>
      <div className="octave">{noteOctave}</div>
    </div>
  );
}