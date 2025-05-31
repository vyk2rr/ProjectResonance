import type { Route } from "./+types/home";
import UkuleleFretboard from "../ukulele-fretboard/ukulele-fretboard"

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Ukulele Fretboard" },
    { name: "description", content: "" },
  ];
}

export default function UkuleleFretboardPage() {
  return <>
    <div style={{ width: '150px' }}>
      cejilla traste 1
      <UkuleleFretboard markers={[[4, 1], [3, 1], [2, 1], [1, 1]]} />
    </div>
    
    <div style={{ width: '250px' }}>
      cuerdas sueltas: 
      <UkuleleFretboard markers={[[4, 0], [3, 0], [2, 0], [1, 0]]} />
    </div>

    <div style={{ width: '550px' }}>
      2da cuerda (E) en traste tres
      <UkuleleFretboard markers={[[4, 0], [3, 0], [2, 3], [1, 0]]} />
    </div>

    4ta suelta, 3era 1er traste, 2da 2do traste, 1era en 3er traste.
    <UkuleleFretboard markers={[[4, 0], [3, 1], [2, 2], [1, 3]]} />
  </>;
}
