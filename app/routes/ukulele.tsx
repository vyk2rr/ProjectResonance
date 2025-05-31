import type { Route } from "./+types/home";
import Ukulele from "./../ukulele/ukulele";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Ukulele Synth Sound" },
    { name: "description", content: "A button that plays a synthesized ukulele G4 string sound using Tone.js" },
  ];
}

export default function UkulelePage() {
  return <Ukulele />;
}
