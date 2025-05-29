import { Piano } from '../piano/piano';

export function Welcome() {
  return (
    <main>
      <Piano />
      <div style={{width: 400}}><Piano /></div>
      <div style={{width: 500}}><Piano /></div>
    </main>
  );
}
