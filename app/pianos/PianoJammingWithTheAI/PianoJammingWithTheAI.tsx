import * as Tone from 'tone';
import React, { useState, useRef, useEffect } from 'react';
import PianoBase, { PianoBaseHandle } from '../../PianoBase/PianoBase';
import ChordDispatcher from "../../ChordDispatcher/ChordDispatcher";
import type { tMelodySequence, iChordEvent } from "../../ChordDispatcher/ChordDispatcher";
import { AIService } from './PianoJammingWithTheAI.ai.service';

export interface AIResponse {
  melodyEvents: iChordEvent[];
}

const removeThinkTags = (aiResponse: string): string => {
  // Eliminar todo el contenido entre <think> y </think>, incluyendo las etiquetas
  const cleanResponse = aiResponse.replace(/<think>[\s\S]*?<\/think>/g, '');

  // Eliminar líneas vacías extras y espacios al inicio/final
  return cleanResponse
    .replace(/^\s+|\s+$/g, '')     // Eliminar espacios al inicio y final
    .replace(/\n\s*\n\s*\n/g, '\n\n')  // Reducir múltiples líneas vacías a máximo dos
    .trim();
};

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

  const launchCallAndWait = async () => {
    setLoading(true);
    try {
      const response = await AIService.generateMelody(currentMelody);
      const cleanResponse = removeThinkTags(response);

      if (cleanResponse) {
        setAiResponse(JSON.stringify(cleanResponse));
      } else {
        console.error('No se pudo obtener una respuesta JSON válida');
        console.error('Raw ai response:', response);
        console.error('cleaned ai response:', cleanResponse);
      }
    } catch (error) {
      console.error("Error en la llamada a la API de IA", error);
    } finally {
      setLoading(false);
    }
  };

  const playAIResponse = async () => {
    if (!pianoRef.current || !aiResponse) return;

    const melodyEvents = extractMelodyFromAIResponse(aiResponse);
    if (!melodyEvents) {
      console.error('Respuesta de IA inválida', melodyEvents, aiResponse);
      return;
    }

    await Tone.start();
    const scheduler = new ChordDispatcher(pianoRef.current.triggerChordEvent, 80);
    await scheduler.startSequence(melodyEvents);
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
      <h2>JamSession v0.1</h2>
      <h3>Human ↔ AI Musical Exchange</h3>
      <button onClick={playMelody}>Play user improvisation</button>
      <button onClick={launchCallAndWait} disabled={loading}>Send melody to AI agent</button>
      <button
        onClick={playAIResponse}
        disabled={!aiResponse || loading}
      >
        Play AI improvisation
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

export function extractMelodyEventsJSON(raw: string): any | null {
  // Elimina etiquetas <think> y comillas externas si existen
  let clean = raw.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

  // Si está envuelto en comillas, quítalas
  if ((clean.startsWith('"') && clean.endsWith('"')) || (clean.startsWith("'") && clean.endsWith("'"))) {
    clean = clean.slice(1, -1);
  }

  // Busca el primer { y el último }
  const start = clean.indexOf('{');
  const end = clean.lastIndexOf('}');
  if (start === -1 || end === -1) {
    console.error('No se encontró estructura JSON válida');
    return null;
  }

  const jsonStr = clean.substring(start, end + 1);

  try {
    // Intenta parsear el JSON
    const parsed = JSON.parse(jsonStr);
    if (parsed.melodyEvents && Array.isArray(parsed.melodyEvents)) {
      return parsed.melodyEvents;
    }
    // Si melodyEvents no está en el root, intenta buscarlo con regex
    const match = jsonStr.match(/"melodyEvents"\s*:\s*(\[[\s\S]*\])/);
    if (match) {
      return JSON.parse(match[1]);
    }
    return null;
  } catch (e) {
    console.error('Error al parsear JSON:', e, jsonStr);
    return null;
  }
}

export function extractMelodyFromAIResponse(aiResponse: string): any[] | null {
  // 1. Quitar comillas externas si existen
  let clean = aiResponse.trim();
  if ((clean.startsWith('"') && clean.endsWith('"')) || (clean.startsWith("'") && clean.endsWith("'"))) {
    clean = clean.slice(1, -1);
  }

  // 2. Quitar bloque markdown ```json ... ```
  clean = clean.replace(/^```json\\n|\\n```$/g, "");
  clean = clean.replace(/^```json\n|```$/g, ""); // Por si acaso

  // 3. Reemplazar secuencias escapadas
  clean = clean.replace(/\\n/g, "\n").replace(/\\"/g, '"');

  // 4. Buscar el primer { y el último }
  const start = clean.indexOf("{");
  const end = clean.lastIndexOf("}");
  if (start === -1 || end === -1) return null;

  const jsonStr = clean.substring(start, end + 1);

  try {
    const parsed = JSON.parse(jsonStr);
    if (parsed.melody && Array.isArray(parsed.melody)) {
      return parsed.melody;
    }
    return null;
  } catch (e) {
    console.error("Error al parsear JSON:", e, jsonStr);
    return null;
  }
}

export default PianoJammingWithTheAI;