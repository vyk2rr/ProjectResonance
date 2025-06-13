import React, { useRef, useEffect, useState } from "react";
import * as Tone from "tone";
import { PianoUkulele } from "../pianos/PianoUkulele";
import UkuleleFretboard from "../UkuleleFretboard/UkuleleFretboard"

export default function Ukulele() {
  const synthRef = useRef<Tone.PluckSynth | null>(null);
  const [strumDelay, setStrumDelay] = useState(0.12); // seconds between notes

  useEffect(() => {
    synthRef.current = new Tone.PluckSynth({
      attackNoise: 1.2, // más percusivo
      dampening: 4000,  // más brillante
      resonance: 0.98,  // más sustain
    }).toDestination();
    return () => {
      synthRef.current?.dispose();
    };
  }, []);

  const pluckG = () => {
    if (!synthRef.current) return;
    synthRef.current?.triggerAttack("G4");
  };

  const strumTheUkulele = () => {
    if (!synthRef.current) return;
    synthRef.current.triggerAttack("G4", "+0");
    synthRef.current.triggerAttack("C4", `+${strumDelay * 1}`);
    synthRef.current.triggerAttack("E4", `+${strumDelay * 2}`);
    synthRef.current.triggerAttack("A4", `+${strumDelay * 3}`);
  };

  const Cmaj = () => {
    if (!synthRef.current) return;
    synthRef.current.triggerAttack("G4", "+0");
    synthRef.current.triggerAttack("C4", `+${strumDelay * 1}`);
    synthRef.current.triggerAttack("E4", `+${strumDelay * 2}`);
    synthRef.current.triggerAttack("C5", `+${strumDelay * 3}`);

  };

  const Dmin = () => {
    if (!synthRef.current) return;
    synthRef.current.triggerAttack("A4", "+0");
    synthRef.current.triggerAttack("D4", `+${strumDelay * 1}`);
    synthRef.current.triggerAttack("F4", `+${strumDelay * 2}`);
    synthRef.current.triggerAttack("A4", `+${strumDelay * 3}`);
  };

  const Emin = () => {
    if (!synthRef.current) return;
    synthRef.current.triggerAttack("G4", "+0");
    synthRef.current.triggerAttack("E4", `+${strumDelay * 1}`);
    synthRef.current.triggerAttack("G4", `+${strumDelay * 2}`);
    synthRef.current.triggerAttack("B4", `+${strumDelay * 3}`);
  };

  const Fmaj = () => {
    if (!synthRef.current) return;
    synthRef.current.triggerAttack("G4", "+0");
    synthRef.current.triggerAttack("C4", `+${strumDelay * 1}`);
    synthRef.current.triggerAttack("F4", `+${strumDelay * 2}`);
    synthRef.current.triggerAttack("A4", `+${strumDelay * 3}`);
  };

  const Gmaj = () => {
    if (!synthRef.current) return;
    synthRef.current.triggerAttack("G4", "+0");
    synthRef.current.triggerAttack("D4", `+${strumDelay * 1}`);
    synthRef.current.triggerAttack("G4", `+${strumDelay * 2}`);
    synthRef.current.triggerAttack("B4", `+${strumDelay * 3}`);
  };

  const Amin = () => {
    if (!synthRef.current) return;
    synthRef.current.triggerAttack("A4", "+0");
    synthRef.current.triggerAttack("C4", `+${strumDelay * 1}`);
    synthRef.current.triggerAttack("E4", `+${strumDelay * 2}`);
    synthRef.current.triggerAttack("A4", `+${strumDelay * 3}`);
  };

  const Bdim = () => {
    if (!synthRef.current) return;
    synthRef.current.triggerAttack("B4", "+0");
    synthRef.current.triggerAttack("D4", `+${strumDelay * 1}`);
    synthRef.current.triggerAttack("F#4", `+${strumDelay * 2}`);
    synthRef.current.triggerAttack("B4", `+${strumDelay * 3}`);
  };

  const renderStrumSpeedSlider = () => (
    <div style={{ width: "200px" }}>
      {/* <label>
        Strum speed:{" "}
        <Slider
          min={0.05}
          max={0.3}
          step={0.01}
          value={[strumDelay]}
          size="3"

          color="crimson"
          onValueChange={value => setStrumDelay(Number(value))}
        />{" "}
        {strumDelay}s
      </label> */}
    </div>
  );

  return (
    <>
      <h1>Ukulele</h1>

      <div style={{ width: "500px" }}>
        <ul>
          <li><button onClick={pluckG}>Pluck G (G4)</button></li>
          <li><button onClick={strumTheUkulele}>Strum The Ukulele C6 (G4 → C4 → E4 → A4)</button></li>
        </ul>
        {renderStrumSpeedSlider()}
      </div>

      <div style={{ width: "500px" }}>
        <li><button onClick={Cmaj}>play Cmaj (G4 → C4 → E4 → C)</button></li>
        <li><button onClick={Dmin}>play Dmin</button></li>
        <li><button onClick={Emin}>play Emin</button></li>
        <li><button onClick={Fmaj}>play Fmaj</button></li>
        <li><button onClick={Gmaj}>play Gmaj</button></li>
        <li><button onClick={Amin}>play Amin</button></li>
        <li><button onClick={Bdim}>play Bdim</button></li>
      </div>
      <div style={{ width: "200px" }}>
        <UkuleleFretboard />
      </div>
      <div>
        <PianoUkulele />
      </div>
    </>
  );
}