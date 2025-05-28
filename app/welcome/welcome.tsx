import { Theme } from '@radix-ui/themes';
import { Piano } from '../piano/piano';

export function Welcome() {
  return (
    <main>
      <Theme accentColor='purple'>
        <Piano />
      </Theme>
    </main>
  );
}
