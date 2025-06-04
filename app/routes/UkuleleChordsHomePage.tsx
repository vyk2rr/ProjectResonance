import type { Route } from "./+types/home";
import UkuleleChordsList from "../UkuleleChordsList/UkuleleChordsList";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Ukulele Fretboard" },
    { name: "description", content: "Chord diagrams for ukulele" },
  ];
}

export default function UkuleleChordsHomePage() {
  return (
    <UkuleleChordsList />
  );
}
