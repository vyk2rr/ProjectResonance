import PianoBase from '../PianoBase/pianobase';
import { PianoEtherealStrings } from '../pianos/PianoEtherealStrings';
import { PianoOption2 } from '../pianos/PianoOption2';
import { PianoOption3 } from '../pianos/PianoOption3';
import { PianoOption5 } from '../pianos/PianoOption5';
import { PianoOption6 } from '../pianos/PianoOption6';
import { PianoOption7 } from '../pianos/PianoOption7';
import { PianoOption8 } from '../pianos/PianoOption8';
import { PianoUkulele } from '../pianos/PianoUkulele';


export function Welcome() {
  return (
    <main>
      <span>Piano base</span>
      <PianoBase />

      <span>Piano ukulele</span>
      <PianoUkulele />

      <span>Piano1: etéreo con timbre de cuerdas suaves y ambiente envolvente</span>
      <PianoEtherealStrings /> 

      {/* <span>Piano2: espacial con eco y profundidad envolvente</span>
      <PianoOption2 /> */}

      {/* <span>Piano3 digital brillante y espacial, con carácter retro y profundidad.</span>
      <PianoOption3 /> */}

      <span>Piano tipo cuenco de cristal: etéreo y resonante</span>
      <PianoOption5 octaves={5} />

      <span>Piano6: crujiente como pisando hojas secas en otoño</span>
      <PianoOption6 />

      <span>Piano7: tipo "hu"</span>
      <PianoOption7 />

      <span>Piano8: metálico tipo laser</span>
      <PianoOption8 />
    </main>
  );
}
