import * as Tone from "tone";
import { PianoBase } from "../pianobase/pianobase";

export function PianoOption8() {
  return (
    <>
      <PianoBase
        octaves={1}
        createSynth={() => {
          //  metálico pulsante

          // Sintetizador principal
          const synth = new Tone.MonoSynth({
            oscillator: {
              type: "square"
            },
            envelope: {
              attack: 0.01,
              decay: 0.2,
              sustain: 0.0,
              release: 0.3
            },
            filter: {
              Q: 6,
              type: "bandpass",
              frequency: 800
            },
            filterEnvelope: {
              attack: 0.01,
              decay: 0.1,
              sustain: 0.1,
              release: 0.2,
              baseFrequency: 500,
              octaves: 2.5
            }
          });

          // Tremolo (LFO en volumen)
          const tremolo = new Tone.Tremolo({
            frequency: 2,   // dos pulsos por segundo
            depth: 0.75,    // intensidad del efecto
            spread: 180     // estéreo completo
          }).start();

          // Compresor para más pegada
          const compressor = new Tone.Compressor(-20, 3);

          // Reverb seco y corto, como golpe metálico en espacio cerrado
          const reverb = new Tone.Reverb({ decay: 1.2, wet: 0.3 }).toDestination();

          // Cadena
          synth.chain(tremolo, compressor, reverb);

          // Retorna el sintetizador listo
          return synth;
        }}
      />
    </>
  );
}