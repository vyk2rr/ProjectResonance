import React, { useRef, useState } from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import PianoJammingWithTheAI from "./PianoJammingWithTheAI";
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

describe("PianoJammingWithTheAISequence", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the melody events", () => {
    render(<PianoJammingWithTheAI />);
  });

  it("Reproduce melodía pre-establecida", async () => {
    const toneStartSpy = jest.spyOn(Tone, "start").mockResolvedValue();
    const ChordDispatcher = require("../../ChordDispatcher/ChordDispatcher");

    render(<PianoJammingWithTheAI />);
    const button = screen.getByText("Play user improvisation");

    await act(async () => {
      fireEvent.click(button);
    });

    expect(toneStartSpy).toHaveBeenCalled();
    expect(mockTriggerChordEvent).toHaveBeenCalled();
    expect(mockTriggerChordEvent.mock.calls.length).toBeGreaterThan(5);
    expect(ChordDispatcher).toHaveBeenCalled();

    toneStartSpy.mockRestore();
  });

  it("muestra 'Loading...' mientras espera la respuesta de la IA", async () => {
    // Asegúrate de que fetch existe en globalThis
    if (!globalThis.fetch) {
      globalThis.fetch = jest.fn();
    }
    const fetchMock = jest
      .spyOn(globalThis, "fetch")
      .mockImplementation(() =>
        Promise.resolve({
          json: () => new Promise(resolve => setTimeout(() => resolve({ response: "{}" }), 100)),
        } as any)
      );

    render(<PianoJammingWithTheAI />);
    const button = screen.getByText("Send melody to AI agent");
    fireEvent.click(button);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    fetchMock.mockRestore();
  });

  it("deshabilita el botón de reproducir IA si no hay respuesta", () => {
    render(<PianoJammingWithTheAI />);
    const btn = screen.getByText("Play AI improvisation");
    expect(btn).toBeDisabled();
  });

  it("parsea correctamente una respuesta AI válida y llama a triggerChordEvent al reproducir", async () => {
    const aiResponse = `"""json
{
  "melody": [
    {
      "pitches": ["C4"],
      "time": "0:0:0",
      "duration": "4n",
      "velocity": 0.8,
      "highlightGroup": 1
    }
  ]
}
"""`;

    if (!globalThis.fetch) {
      globalThis.fetch = jest.fn();
    }
    const fetchMock = jest
      .spyOn(globalThis, "fetch")
      .mockImplementation(() =>
        Promise.resolve({
          json: () => Promise.resolve({ response: aiResponse }),
        } as any)
      );

    render(<PianoJammingWithTheAI />);
    const sendButton = screen.getByText("Send melody to AI agent");

    await act(async () => {
      fireEvent.click(sendButton);
    });

    const playAIButton = await screen.findByText("Play AI improvisation");
    expect(playAIButton).not.toBeDisabled();

    await act(async () => {
      fireEvent.click(playAIButton);
    });

    expect(mockTriggerChordEvent).toHaveBeenCalled();
    const calledWithC4 = mockTriggerChordEvent.mock.calls.some(
      ([event]) => event && event.pitches && event.pitches.includes("C4")
    );
    expect(calledWithC4).toBe(true);

    fetchMock.mockRestore();
  });

  it("maneja errores de parseo de la IA sin romper la UI", async () => {
    // Simula una respuesta AI inválida (no es JSON)
    const aiResponse = "esto no es un json válido";

    if (!globalThis.fetch) {
      globalThis.fetch = jest.fn();
    }
    const fetchMock = jest
      .spyOn(globalThis, "fetch")
      .mockImplementation(() =>
        Promise.resolve({
          json: () => Promise.resolve({ response: aiResponse }),
        } as any)
      );

    // Espía console.error para verificar que se loguea el error
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(<PianoJammingWithTheAI />);
    const sendButton = screen.getByText("Send melody to AI agent");

    await act(async () => {
      fireEvent.click(sendButton);
    });

    const playAIButton = await screen.findByText("Play AI improvisation");
    expect(playAIButton).not.toBeDisabled();

    // Click en reproducir IA (esto intentará parsear el JSON inválido)
    await act(async () => {
      fireEvent.click(playAIButton);
    });

    // No debe lanzar excepción ni romper la UI
    expect(screen.getByText("Play AI improvisation")).toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalled();

    fetchMock.mockRestore();
    consoleErrorSpy.mockRestore();
  });

});