import React, { useState } from "react";
import PianoBase from "./../../PianoBase/PianoBase";

export default function PianoWithSequenceButton() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sequenceToPlay, setSequenceToPlay] = useState<string[]>([]);

  const handleTriggerSequence = () => {
    setIsPlaying(true);
    setSequenceToPlay([
      ["C", "E", "G"],
      "D",
      "E",
      ["F", "A", "C"],
      "G",
      "A",
      "B"
    ]);
  };

  return (<>
    <PianoBase
      chordMap={{}}
      sequenceToPlay={sequenceToPlay}
      onSequenceEnd={() => setSequenceToPlay([])}
    />

    <button onClick={handleTriggerSequence} disabled={isPlaying}>
      <h1>Clikc to Trigger Sequence</h1>
    </button>
  </>);
}