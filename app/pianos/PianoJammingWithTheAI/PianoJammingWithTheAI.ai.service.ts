import { ENV_CONFIG } from '../../../env.local';
import type { tMelodySequence } from '../../ChordDispatcher/ChordDispatcher';

export class AIService {
  static async generateMelody(currentMelody: tMelodySequence) {
    try {
      const response = await fetch(`${ENV_CONFIG.IA.BRAIN_API_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parameters: ENV_CONFIG.IA.BRAIN_DEFAULT_PARAMS,
          model: ENV_CONFIG.IA.BRAIN_MODEL,
          prompt: this.buildPrompt(currentMelody),
          stream: false,
          thinking: false,
          response_format: { type: ENV_CONFIG.IA.BRAIN_DEFAULT_PARAMS.response_format.type },
        }),
      });
      
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("Error en la llamada a la API de IA", error);
      throw error;
    }
  }

  private static buildPrompt(melody: tMelodySequence): string {
    return `[INSTRUCCIONES]
Eres un compositor musical que SOLO responde con JSON.
NO incluyas ningún otro texto o explicación.

[REGLAS]
- Genera una respuesta musical que complemente esta melodía
- Mantén coherencia armónica con la melodía original
- Los tiempos deben estar sincronizados
- Cada nota debe incluir todos los campos requeridos
- SOLO responde el objeto JSON, nada más

[ENTRADA]
${JSON.stringify(melody)}

[FORMATO DE RESPUESTA]
{
  "melodyEvents": [{
    "pitches": ["C4","E4"],     // notas
    "time": "0:0:0",            // compás:pulso:subdivisión
    "duration": "4n",           // 4n, 8n, 16n, 2n
    "velocity": 0.8,            // 0-1
    "highlightGroup": 1         // 1=izq, 2=der
  }]
}

[IMPORTANTE]
- SOLO devuelve el JSON válido sin ningún texto adicional. responde estrictamente con un objeto como este: { "melody": [...] }
- No incluyas etiquetas
- NO incluyas explicaciones
- NO incluyas comentarios
- NO incluyas código extra`;
  }
}