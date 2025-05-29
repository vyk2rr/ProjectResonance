import './piano.css';

export function Piano() {
  return (
    <div className="piano">
      <div className="piano">
        <div className="white-keys">
          <div className="white-key" data-note="C4"></div>
          <div className="white-key" data-note="D4"></div>
          <div className="white-key" data-note="E4"></div>
          <div className="white-key" data-note="F4"></div>
          <div className="white-key" data-note="G4"></div>
          <div className="white-key" data-note="A4"></div>
          <div className="white-key" data-note="B4"></div>
          <div className="white-key" data-note="C5"></div>
        </div>
        <div className="black-keys">
          <div className="black-key" data-note="C#4"></div>
          <div className="black-key" data-note="D#4"></div>
          <div className="black-key" data-note="F#4"></div>
          <div className="black-key" data-note="G#4"></div>
          <div className="black-key" data-note="A#4"></div>
        </div>
      </div>
    </div>
  );
}
