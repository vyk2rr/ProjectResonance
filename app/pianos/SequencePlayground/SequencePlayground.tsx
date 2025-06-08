import React, { useState } from "react";
import {PianoDryLeaf} from "../PianoDryLeaf";
import type { tChord } from "../../PianoBase/PianoBase.types";

export default function SequencePlayground() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sequenceToPlay, setSequenceToPlay] = useState<tChord[]>([]);

  const handleTriggerSequence = () => {
    setIsPlaying(true);
    setSequenceToPlay([
      ["E4", "B4", "G5", "B5", "E6"]
    ] as tChord[]);
  };

  return (<>
    <PianoDryLeaf
      sequenceToPlay={sequenceToPlay}
      onSequenceEnd={() => {
        console.log("Sequence ended"); 
        setSequenceToPlay([]);
        setIsPlaying(false);
      }}
    />

    <button onClick={handleTriggerSequence} disabled={isPlaying}>
      <h1>🚀 Zap!</h1>
    </button>
  </>);
}