import type { Route } from "./+types/home";
import UkuleleDiagram from "../ukulele-diagram/ukulele_diagram"

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Ukulele Synth Sound" },
    { name: "description", content: "A button that plays a synthesized ukulele G4 string sound using Tone.js" },
  ];
}

export default function UkulelePage() {
  return <>
    <div style={{ width: '150px' }}>
      <UkuleleDiagram markers={[[4, 1], [3, 1], [2, 1], [1, 1]]} />
    </div>
    
    <div style={{ width: '250px' }}>
      <UkuleleDiagram markers={[[4, 0], [3, 0], [2, 0], [1, 0]]} />
    </div>

    <div style={{ width: '550px' }}>
      <UkuleleDiagram markers={[[4, 0], [3, 0], [2, 0], [1, 0]]} />
    </div>
  </>;
}
