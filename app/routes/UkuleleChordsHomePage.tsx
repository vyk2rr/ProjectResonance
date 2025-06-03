import type { Route } from "./+types/home";
import UkuleleFretboard from "../ukulele-fretboard/UkuleleFretboard";
import './UkuleleChordsHomePage.css'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Ukulele Fretboard" },
    { name: "description", content: "Chord diagrams for ukulele" },
  ];
}

const chords = [
  { name: "C", markers: ["G4", "C4", "E4", "C5"]},
  { name: "Dm", markers: ["A4", "D4", "F4", "A4"] },
  { name: "Em", markers: ["G4", "E4", "G4", "B4"] },
  { name: "F", markers: ["A4", "C4", "F4", "A4"] },
  { name: "G", markers: ["G4", "D4", "G4", "B4"] },
  { name: "Am", markers: ["A4", "C4", "E4", "A4"] },
  { name: "Bdim", markers: ["B4", "D4", "F#4", "B4"] },
];

export default function UkuleleChordsHomePage() {
  return (
    <div className="ukulele-chords-list">
      {chords.map(({ name, markers }) => (
        <div className="ukulele-chord" key={name}>
         <span className="ukulele-fret-number">{name}</span>
          <UkuleleFretboard markers={markers} />
        </div>
      ))}
    </div>
  );
}
