import * as Tone from "tone";
import React, { useState } from "react";
import { PianoDryLeaf } from "../PianoDryLeaf";
import type { tChordSequence } from "../../PianoBase/PianoBase.types";

export default function PianoZap() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sequenceToPlay, setSequenceToPlay] = useState<tChordSequence>([]);
  const [highlightedKeys, setHighlightedKeys] = useState(false);

  const handleTriggerSequence = (highlightedKeys: boolean = true) => {
    setIsPlaying(true);
    setHighlightedKeys(highlightedKeys);
    setSequenceToPlay([
      ["E4", "B4", "G5", "B5", "E6"],
      ["E4", "B4", "G5"]
    ] as tChordSequence);
  };

  return (<>
    <PianoDryLeaf
      id="piano-zap"
      sequenceToPlay={{
        sequenceToPlay: sequenceToPlay,
        highlightedKeys: highlightedKeys,
        onSequenceEnd: () => {
          setSequenceToPlay([]);
          setIsPlaying(false);
        }
      }}
    />

    <br />

    <button onClick={() => handleTriggerSequence(true)} disabled={isPlaying}>
      <h1>🚀 Zap with Highlight!</h1>
    </button>

    <br />
    <br />

    <button onClick={() => handleTriggerSequence(false)} disabled={isPlaying}>
      <h1>🚀 Zap without highlighted keys!</h1>
    </button>

  </>);
}