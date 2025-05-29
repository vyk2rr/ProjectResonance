import React, { useRef, useEffect } from "react";
import * as Tone from "tone";

export default function Ukulele() {
  const synthRef = useRef<Tone.PluckSynth | null>(null);

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

  const playG = () => {
    synthRef.current?.triggerAttack("G4");
  };

  return (
    <div>
      <h2>Ukulele G4</h2>
      <button onClick={playG}>Tocar cuerda G (G4)</button>
    </div>
  );
}