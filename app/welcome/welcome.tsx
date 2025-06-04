import PianoBase from '../PianoBase/pianobase';
import { PianoEtherealStrings } from '../pianos/PianoEtherealStrings';
import { PianoQuartzEcho } from '../pianos/PianoQuartzEcho';
import { PianoDryLeaf } from '../pianos/PianoDryLeaf';
import { PianoHu } from '../pianos/PianoHu';
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

      <PianoQuartzEcho octaves={5} showDescription />

      <PianoDryLeaf showDescription />

      <PianoHu showDescription/>

      <span>Piano8: metálico tipo laser</span>
      <PianoOption8 />
    </main>
  );
}
