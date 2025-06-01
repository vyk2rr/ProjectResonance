import React, { useRef, useEffect, useState } from "react";
import * as Tone from "tone";
import { Button, Slider, Heading, Box, Card } from "@radix-ui/themes";
import { PianoUkulele } from "../pianos/piano_ukulele";
import UkuleleFretboard from "../ukulele-fretboard/ukulele-fretboard"

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
      <label>
        Strum speed:{" "}
        <Slider
          min={0.05}
          max={0.3}
          step={0.01}
          value={[strumDelay]}
          size="3"
          variant="soft"
          color="crimson"
          onValueChange={value => setStrumDelay(Number(value))}
        />{" "}
        {strumDelay}s
      </label>
    </div>
  );

  return (
    <>
      <Heading as="h1" size="9" color="cyan">Ukulele</Heading>

      <Box width="500px">
        <Card size="3">
          <ul>
            <li><Button onClick={pluckG} radius="none" variant="classic">Pluck G (G4)</Button></li>
            <li><Button onClick={strumTheUkulele} variant="classic" color="red">Strum The Ukulele C6 (G4 → C4 → E4 → A4)</Button></li>
          </ul>
          {renderStrumSpeedSlider()}
        </Card>
      </Box>

      <Box width="500px">
        <Card size="3">
          <li><Button onClick={Cmaj} variant="classic" color="red">play Cmaj (G4 → C4 → E4 → C)</Button></li>
          <li><Button onClick={Dmin} variant="classic" color="orange">play Dmin</Button></li>
          <li><Button onClick={Emin} variant="classic" color="yellow">play Emin</Button></li>
          <li><Button onClick={Fmaj} variant="classic" color="green">play Fmaj</Button></li>
          <li><Button onClick={Gmaj} variant="classic" color="blue">play Gmaj</Button></li>
          <li><Button onClick={Amin} variant="classic" color="darkblue">play Amin</Button></li>
          <li><Button onClick={Bdim} variant="classic" color="violet">play Bdim</Button></li>
        </Card>
      </Box>
      <Box width="200px">
        <UkuleleFretboard />
      </Box>
      <Box>
        <PianoUkulele />
      </Box>
    </>
  );
}