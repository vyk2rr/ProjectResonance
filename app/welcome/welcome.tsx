import PianoBase from '../PianoBase/pianobase';
import { PianoEtherealStrings } from '../pianos/PianoEtherealStrings';
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

      <PianoEtherealStrings showDescription />

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
