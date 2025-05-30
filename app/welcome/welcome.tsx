import { PianoBase } from '../pianobase/pianobase';
import { PianoOption1 } from '../pianos/piano1';
import { PianoOption2 } from '../pianos/piano2';
import { PianoOption3 } from '../pianos/piano3';
import { PianoOption5 } from '../pianos/piano5';
import { PianoOption6 } from '../pianos/piano6';


export function Welcome() {
  return (
    <main>
      <PianoBase />
      <PianoOption1 />
      <PianoOption2 />
      <PianoOption3 />
      <PianoOption5 />
      ....
      <PianoOption6 />
  
    </main>
  );
}
