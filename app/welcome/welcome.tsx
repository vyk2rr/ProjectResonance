import { Theme } from '@radix-ui/themes';
import { Piano } from '../piano/piano';

export function Welcome() {
  return (
    <main>
      <Theme accentColor='purple'>
        <Piano />
        <div style={{width: 400}}><Piano /></div>
        <div style={{width: 500}}><Piano /></div>
      </Theme>
    </main>
  );
}
