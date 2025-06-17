import React, { useEffect, useState } from "react";
import PianoBase from "../../PianoBase/PianoBase";
import { PianoObserver } from "../../PianoObserver/PianoObserver";

// Instancia única, puedes mover esto a un contexto si lo necesitas global
const pianoObserver = new PianoObserver();

export default function PianoMiniDashboard() {
  // Estado para guardar las últimas notas presionadas
  const [recentNotes, setRecentNotes] = useState<string[]>([]);

  useEffect(() => {
    // Suscribirse a eventos de PianoObserver
    const unsubscribe = pianoObserver.subscribe(event => {
      if (event.type === "notePlayed") {
        setRecentNotes(prev => {
          // Mantén solo las últimas 5 notas (ajusta el número como quieras)
          const newNotes = [event.note, ...prev];
          return newNotes.slice(0, 5);
        });
      }
    });
    // Limpia la suscripción al desmontar el componente
    return unsubscribe;
  }, []);

  return (
    <div className="piano-mini-dashboard">
      <h2>Piano Mini Dashboard</h2>

      <div>
        <h3>Últimas teclas presionadas:</h3>
        {recentNotes.join(", ") || "No hay teclas presionadas aún."}
      </div>

      <PianoBase pianoObservable={pianoObserver} />
    </div>
  );
}