import React, { useState } from "react";
import PianoBase from "../../PianoBase/PianoBase";
import type { tChord } from "../../PianoBase/PianoBase.types";

export default function SequencePlayground() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sequenceToPlay, setSequenceToPlay] = useState<tChord[]>([]);

  const handleTriggerSequence = () => {
    setIsPlaying(true);
    setSequenceToPlay([["D4", "A4", "F#5", "A5", "D6"]] as tChord[]);
  };

  return (<>
    <PianoBase
      chordMap={{}}
      sequenceToPlay={sequenceToPlay}
      onSequenceEnd={() => setSequenceToPlay([])}
    />

    <button onClick={handleTriggerSequence} disabled={isPlaying}>
      <h1>🚀 Zap!</h1>
    </button>
  </>);
}