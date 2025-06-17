import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import PianoMelody from "./PianoMelody";
import * as Tone from "tone";

let mockTriggerChordEvent: jest.Mock;

jest.mock("../../PianoBase/PianoBase", () => {
  const React = require("react");
  mockTriggerChordEvent = jest.fn();
  return {
    __esModule: true,
    // @ts-ignore
    default: React.forwardRef((props, ref) => {
      React.useImperativeHandle(ref, () => ({
        triggerChordEvent: mockTriggerChordEvent,
      }));
      return (
        <div data-testid="piano-base-mock">
          PianoBaseMock
        </div>
      );
    }),
  };
});

jest.mock("../../ChordDispatcher/ChordDispatcher", () => {
  return jest.fn().mockImplementation((triggerChordEvent: any) => ({
    startSequence: jest.fn(async (melody) => {
      for (const event of melody) {
        triggerChordEvent(event);
      }
    }),
  }));
});

beforeAll(() => {
  if (!("start" in Tone)) {
    // @ts-ignore
    Tone.start = jest.fn().mockResolvedValue(undefined);
  }
});

afterAll(() => {
  // @ts-ignore
  if (Tone.start && Tone.start.mockRestore) Tone.start.mockRestore();
});

describe("PianoMelodySequence", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the melody events", () => {
    render(<PianoMelody />);
    expect(screen.getByText(/0:0:0 chords: \[D4, F#4, A4\] duration: 4n velocity: 0.8/)).toBeInTheDocument();
    expect(screen.getByText(/0:0:1 chords: \[E4, G4, B4\] duration: 4n velocity: 0.8/)).toBeInTheDocument();
    expect(screen.getByText(/0:4:0 chords: \[D4, F#4, A4\] duration: 1n velocity: 0.8/)).toBeInTheDocument();
  });

  it("calls Tone.start and triggers the melody sequence when button is clicked", async () => {
    const toneStartSpy = jest.spyOn(Tone, "start").mockResolvedValue();
    const ChordDispatcher = require("../../ChordDispatcher/ChordDispatcher");

    render(<PianoMelody />);
    const button = screen.getByText("Reproducir Melodía");

    await act(async () => {
      fireEvent.click(button);
    });

    expect(toneStartSpy).toHaveBeenCalled();
    expect(mockTriggerChordEvent).toHaveBeenCalled();
    expect(mockTriggerChordEvent.mock.calls.length).toBeGreaterThan(5);
    expect(ChordDispatcher).toHaveBeenCalled();

    toneStartSpy.mockRestore();
  });
});