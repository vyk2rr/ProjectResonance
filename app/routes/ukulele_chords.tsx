import type { Route } from "./+types/home";
import UkuleleFretboard from "../ukulele-fretboard/ukulele-fretboard";
import './ukulele_chords.css'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Ukulele Fretboard" },
    { name: "description", content: "Chord diagrams for ukulele" },
  ];
}

const chords = [
  { name: "C", markers: [[4, 0], [3, 0], [2, 0], [1, 3]] },
  { name: "Dm", markers: [[4, 2], [3, 2], [2, 1], [1, 0]] },
  { name: "Em", markers: [[4, 0], [3, 4], [2, 3], [1, 2]] },
  { name: "F", markers: [[4, 2], [3, 0], [2, 1], [1, 0]] },
  { name: "G", markers: [[4, 0], [3, 2], [2, 3], [1, 2]] },
  { name: "Am", markers: [[4, 2], [3, 0], [2, 0], [1, 0]] },
  { name: "Bdim", markers: [[4, 4], [3, 2], [2, 2], [1, 2]] },
];

export default function UkuleleChordsHomePage() {
  return (
    <div className="ukulele-chords-list">
      {chords.map(({ name, markers }) => (
        <div className="ukulele-chord">
         <span className="ukulele-fret-number">{name}</span>
          <UkuleleFretboard markers={markers} />
        </div>
      ))}
    </div>
  );g
}
