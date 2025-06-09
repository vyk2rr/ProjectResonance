import * as Tone from "tone";
import PianoBase from "../PianoBase/PianoBase";
import type { PianoBaseProps } from "../PianoBase/PianoBase";

interface PianoMetalicoLaserProps extends PianoBaseProps {
  showDescription?: boolean;
};

export function PianoMetalicoLaser({ showDescription = false, ...props }: PianoMetalicoLaserProps) {
  return (
    <>
      {showDescription ? <span>Piano metálico tipo laser</span> : null}
      <PianoBase
        {...props}
        createSynth={() => {
          // PolySynth con MonoSynth como voz
          const synth = new Tone.PolySynth(Tone.MonoSynth, {
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
            frequency: 2,
            depth: 0.75,
            spread: 180
          }).start();

          const compressor = new Tone.Compressor(-20, 3);
          const reverb = new Tone.Reverb({ decay: 1.2, wet: 0.3 }).toDestination();

          synth.chain(tremolo, compressor, reverb);

          return synth;
        }}
      />
    </>
  );
}