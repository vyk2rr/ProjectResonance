type PianoEvent = 
  | { type: "notePlayed", note: string }
  | { type: "chordPlayed", chord: string[] }
  | { type: "sequenceEnded" };

type Listener = (event: PianoEvent) => void;

export class PianoObservable {
  private listeners: Listener[] = [];

  subscribe(listener: Listener) {
    this.listeners.push(listener);
    // Devuelve función para desuscribirse
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify(event: PianoEvent) {
    this.listeners.forEach(listener => listener(event));
  }
}