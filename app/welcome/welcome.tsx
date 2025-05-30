import { PianoBase } from '../pianobase/pianobase';
import { PianoOption1 } from '../pianos/piano1';
import { PianoOption2 } from '../pianos/piano2';
import { PianoOption3 } from '../pianos/piano3';
import { PianoOption5 } from '../pianos/piano5';
import { PianoOption6 } from '../pianos/piano6';
import { PianoOption7 } from '../pianos/piano7';
import { PianoOption8 } from '../pianos/piano8';


export function Welcome() {
  return (
    <main>
      <span>Piano base</span>
      <PianoBase />

      {/* <span>Piano1: etéreo con timbre de cuerdas suaves y ambiente envolvente</span>
      <PianoOption1 /> */}

      {/* <span>Piano2: espacial con eco y profundidad envolvente</span>
      <PianoOption2 /> */}

      {/* <span>Piano3 digital brillante y espacial, con carácter retro y profundidad.</span>
      <PianoOption3 /> */}

      <span>Piano tipo cuenco de cristal: etéreo y resonante</span>
      <PianoOption5 />

      <span>Piano6: crujiente como pisando hojas secas en otoño</span>
      <PianoOption6 />

      <span>Piano7: tipo "hu"</span>
      <PianoOption7 />

      <span>Piano8: metálico tipo laser</span>
      <PianoOption8 />
    </main>
  );
}
