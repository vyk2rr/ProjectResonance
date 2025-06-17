import * as Tone from 'tone';
import React, { useState, useRef, useEffect } from 'react';
import PianoBase, { PianoBaseHandle } from '../../PianoBase/PianoBase';
import ChordDispatcher from "../../ChordDispatcher/ChordDispatcher";
import type { tMelodySequence, iChordEvent } from "../../ChordDispatcher/ChordDispatcher";

export const PianoJammingWithTheAI: React.FC = () => {
  const [aiResponse, setAiResponse] = useState<string>('');
  const pianoRef = useRef<PianoBaseHandle>(null);
  const [currentMelody, setCurrentMelody] = useState<tMelodySequence>([]);
  const [loading, setLoading] = useState(false);

  const melodyEvents: iChordEvent[] = [
    // === PARTE 1: Tema Principal Original (0-8 segundos) ===
    { pitches: ["E5"], time: "0:0:0", duration: "16n", velocity: 0.9, highlightGroup: 1 },
    { pitches: ["E5"], time: "0:0:1", duration: "16n", velocity: 0.9, highlightGroup: 1 },
    { pitches: ["E5"], time: "0:0:2", duration: "8n", velocity: 0.9, highlightGroup: 1 },
    { pitches: ["C5"], time: "0:0:3", duration: "16n", velocity: 0.85, highlightGroup: 1 },
    { pitches: ["E5"], time: "0:1:0", duration: "8n", velocity: 0.9, highlightGroup: 1 },
    { pitches: ["G5"], time: "0:1:2", duration: "4n", velocity: 0.85, highlightGroup: 1 },
    { pitches: ["G4"], time: "0:2:0", duration: "4n", velocity: 0.8, highlightGroup: 1 },
    // === PARTE 2: Secuencia Underground (8-16 segundos) ===
    { pitches: ["C5"], time: "1:0:0", duration: "16n", velocity: 0.9, highlightGroup: 1 },
    { pitches: ["C5"], time: "1:0:1", duration: "16n", velocity: 0.9, highlightGroup: 1 },
    { pitches: ["C5"], time: "1:0:2", duration: "8n", velocity: 0.9, highlightGroup: 1 },
    { pitches: ["G4"], time: "1:0:3", duration: "16n", velocity: 0.85, highlightGroup: 1 },
    { pitches: ["Ab4"], time: "1:1:0", duration: "16n", velocity: 0.85, highlightGroup: 1 },
    { pitches: ["A4"], time: "1:1:1", duration: "16n", velocity: 0.9, highlightGroup: 1 },
    { pitches: ["F5"], time: "1:1:2", duration: "8n", velocity: 0.9, highlightGroup: 1 },
    { pitches: ["F5"], time: "1:1:3", duration: "16n", velocity: 0.9, highlightGroup: 1 },
    // === PARTE 3: Secuencia de Estrella (16-24 segundos) ===
    { pitches: ["C5"], time: "2:0:0", duration: "16n", velocity: 1.0, highlightGroup: 1 },
    { pitches: ["E5"], time: "2:0:1", duration: "16n", velocity: 1.0, highlightGroup: 1 },
    { pitches: ["G5"], time: "2:0:2", duration: "16n", velocity: 1.0, highlightGroup: 1 },
    { pitches: ["C6"], time: "2:0:3", duration: "16n", velocity: 1.0, highlightGroup: 1 },
    { pitches: ["G5"], time: "2:1:0", duration: "16n", velocity: 1.0, highlightGroup: 1 },
    { pitches: ["E5"], time: "2:1:1", duration: "16n", velocity: 1.0, highlightGroup: 1 },
    // === PARTE 4: Secuencia de Tuberías (24-32 segundos) ===
    { pitches: ["E5"], time: "3:0:0", duration: "16n", velocity: 0.9, highlightGroup: 1 },
    { pitches: ["C5"], time: "3:0:1", duration: "16n", velocity: 0.85, highlightGroup: 1 },
    { pitches: ["G4"], time: "3:0:2", duration: "16n", velocity: 0.8, highlightGroup: 1 },
    { pitches: ["F4"], time: "3:0:3", duration: "16n", velocity: 0.8, highlightGroup: 1 },
    { pitches: ["E4"], time: "3:1:0", duration: "8n", velocity: 0.9, highlightGroup: 1 },
    { pitches: ["G4"], time: "3:1:2", duration: "8n", velocity: 0.9, highlightGroup: 1 },
    // === PARTE 5: Secuencia de Castillo (32-40 segundos) ===
    { pitches: ["D5"], time: "4:0:0", duration: "16n", velocity: 0.85, highlightGroup: 1 },
    { pitches: ["D5"], time: "4:0:2", duration: "16n", velocity: 0.85, highlightGroup: 1 },
    { pitches: ["B4"], time: "4:1:0", duration: "16n", velocity: 0.8, highlightGroup: 1 },
    { pitches: ["C5"], time: "4:1:2", duration: "16n", velocity: 0.85, highlightGroup: 1 },
    { pitches: ["A4"], time: "4:2:0", duration: "8n", velocity: 0.8, highlightGroup: 1 },
    // === PARTE 6: Tema Principal Variación (40-48 segundos) ===
    { pitches: ["E5"], time: "5:0:0", duration: "16n", velocity: 0.9, highlightGroup: 1 },
    { pitches: ["E5"], time: "5:0:1", duration: "16n", velocity: 0.9, highlightGroup: 1 },
    { pitches: ["E5"], time: "5:0:2", duration: "8n", velocity: 0.9, highlightGroup: 1 },
    { pitches: ["C5"], time: "5:0:3", duration: "16n", velocity: 0.85, highlightGroup: 1 },
    { pitches: ["E5"], time: "5:1:0", duration: "8n", velocity: 0.95, highlightGroup: 1 },
    { pitches: ["G5"], time: "5:1:2", duration: "4n", velocity: 0.9, highlightGroup: 1 },
    // === PARTE 7: Secuencia de Victoria (48-56 segundos) ===
    { pitches: ["C6"], time: "6:0:0", duration: "16n", velocity: 1.0, highlightGroup: 1 },
    { pitches: ["G5"], time: "6:0:2", duration: "16n", velocity: 0.95, highlightGroup: 1 },
    { pitches: ["E5"], time: "6:1:0", duration: "16n", velocity: 0.9, highlightGroup: 1 },
    { pitches: ["C5"], time: "6:1:2", duration: "16n", velocity: 0.85, highlightGroup: 1 },
    { pitches: ["D5"], time: "6:2:0", duration: "8n", velocity: 0.9, highlightGroup: 1 },
    { pitches: ["G5"], time: "6:2:2", duration: "8n", velocity: 0.95, highlightGroup: 1 },
    // === PARTE 8: Final Épico (56-60 segundos) ===
    { pitches: ["C6"], time: "7:0:0", duration: "16n", velocity: 1.0, highlightGroup: 1 },
    { pitches: ["C6"], time: "7:0:1", duration: "16n", velocity: 1.0, highlightGroup: 1 },
    { pitches: ["C6"], time: "7:0:2", duration: "8n", velocity: 1.0, highlightGroup: 1 },
    { pitches: ["G5"], time: "7:1:0", duration: "4n", velocity: 0.95, highlightGroup: 1 },
    { pitches: ["E5"], time: "7:2:0", duration: "4n", velocity: 0.9, highlightGroup: 1 },
    { pitches: ["C5"], time: "7:3:0", duration: "2n", velocity: 1.0, highlightGroup: 1 },
  ];

  const bassEvents: iChordEvent[] = [
    { pitches: ["E4", "G4", "B4"], time: "0:0:0", duration: "4n", velocity: 0.5, highlightGroup: 2 },
    { pitches: ["C4", "E4", "G4"], time: "0:1:0", duration: "4n", velocity: 0.5, highlightGroup: 2 },
    { pitches: ["C4", "C#4", "D4", "D#4"], time: "1:0:0", duration: "4n", velocity: 0.4, highlightGroup: 2 },
    { pitches: ["F#4", "G4", "G#4", "A4"], time: "1:1:0", duration: "4n", velocity: 0.4, highlightGroup: 2 },
    { pitches: ["B4", "C5", "C#5", "D5"], time: "1:2:0", duration: "4n", velocity: 0.4, highlightGroup: 2 },
    { pitches: ["E4", "F4", "F#4", "G#4"], time: "1:3:0", duration: "4n", velocity: 0.4, highlightGroup: 2 },
    { pitches: ["C4", "E4", "G4"], time: "2:0:0", duration: "4n", velocity: 0.5, highlightGroup: 2 },
    { pitches: ["G4", "B4", "D5"], time: "2:1:0", duration: "4n", velocity: 0.5, highlightGroup: 2 },
    { pitches: ["F4", "A4", "C5"], time: "3:0:0", duration: "4n", velocity: 0.5, highlightGroup: 2 },
    { pitches: ["D4", "D#4", "E4", "F4", "F#4", "G4"], time: "4:0:0", duration: "4n", velocity: 0.4, highlightGroup: 2 },
    { pitches: ["A4", "Bb4", "B4", "C5", "C#5", "D5"], time: "4:1:0", duration: "4n", velocity: 0.4, highlightGroup: 2 },
    { pitches: ["E4", "G#4", "B4"], time: "5:0:0", duration: "4n", velocity: 0.5, highlightGroup: 2 },
    { pitches: ["A4", "C5", "E5"], time: "6:0:0", duration: "4n", velocity: 0.5, highlightGroup: 2 },
    { pitches: ["C4", "E4", "G4", "B4"], time: "7:0:0", duration: "2n", velocity: 0.6, highlightGroup: 2 },
  ];

  useEffect(() => {
    const combinedEvents = [...melodyEvents, ...bassEvents];

    // Sort events by their 'time' property to ensure correct playback order
    combinedEvents.sort((a, b) => {
      const timeA = Tone.Time(a.time).toSeconds();
      const timeB = Tone.Time(b.time).toSeconds();
      return timeA - timeB;
    });
    setCurrentMelody(combinedEvents);
  }, []);

  const sendJamProposal = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3.2",
          prompt: `Ping-pong musical.
Músico 1 propone: ${JSON.stringify(currentMelody)}
Genera respuesta musical que complemente.
Formato requerido:
{
  "melodyEvents": [{
    pitches: string[],    // notas ["C4","E4"]
    time: string,         // "compás:pulso:subdivisión"
    duration: string,     // "4n"|"8n"|"16n"|"2n"
    velocity: number,     // 0-1
    highlightGroup: 1|2   // 1=izq, 2=der
  }]
}
Responde solo el JSON.`,
          stream: false,
        }),
      });
      const data = await response.json();
      setAiResponse(data.response);
    } catch (error) {
      console.error("Error en la llamada a la API de IA", error);
    } finally {
      setLoading(false);
    }
  };

  const parseAndValidateAIResponse = (response: string): tMelodySequence | null => {
    try {
      const parsed = JSON.parse(response);
      if (!parsed.melodyEvents || !Array.isArray(parsed.melodyEvents)) {
        return null;
      }

      // Limpia el formato de tiempo (elimina información de BPM si existe)
      const cleanedEvents = parsed.melodyEvents.map((event: iChordEvent) => ({
        ...event,
        time: event.time.split(',')[0], // Mantiene solo la parte del tiempo musical
        velocity: Math.min(Math.max(event.velocity, 0), 1) // Asegura que velocity esté entre 0 y 1
      }));

      return cleanedEvents;
    } catch (e) {
      console.error('Error parsing AI response:', e);
      return null;
    }
  };

  const playAIResponse = async () => {
    if (!pianoRef.current || !aiResponse) return;

    const aiMelody = parseAndValidateAIResponse(aiResponse);
    if (!aiMelody) {
      console.error('Respuesta de IA inválida');
      return;
    }

    await Tone.start();
    const scheduler = new ChordDispatcher(pianoRef.current.triggerChordEvent, 80);
    await scheduler.startSequence(aiMelody);
  };

  const playMelody = async () => {
    if (!pianoRef.current || currentMelody.length === 0) return;
    await Tone.start();

    if (!pianoRef.current.triggerChordEvent) {
      console.error("triggerChordEvent no está definido en pianoRef.current.");
      return;
    }

    const scheduler = new ChordDispatcher(pianoRef.current.triggerChordEvent, 80); // Tempo 180 BPM
    await scheduler.startSequence(currentMelody);
  };

  return (
    <div>
      <h2>Piano Jamming con la IA</h2>
      <button onClick={sendJamProposal} disabled={loading}>Enviar propuesta de jamming</button>
      <button onClick={playMelody}>Reproducir Mi Melodía</button>
      <button
        onClick={playAIResponse}
        disabled={!aiResponse || loading}
      >
        Reproducir Respuesta IA
      </button>
      {loading && <div>Loading...</div>}
      {/* <pre>{aiResponse}</pre> */}
      <PianoBase
        ref={pianoRef}
        octave={3}
      />
    </div>
  );
};

export default PianoJammingWithTheAI;