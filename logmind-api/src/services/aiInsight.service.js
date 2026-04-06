const config = require("../config/config");

const MISTRAL_URL = "https://api.mistral.ai/v1/chat/completions";

/**
 * Genera un texto corto en español usando la API de Mistral.
 * Si no hay MISTRAL_API_KEY, devuelve null.
 */
async function generateInsight(summary, originalName) {
  if (!config.mistralApiKey) {
    return null;
  }

  const userContent = JSON.stringify(
    {
      archivo: originalName,
      resumen: summary,
    },
    null,
    2,
  );

  const res = await fetch(MISTRAL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.mistralApiKey}`,
    },
    body: JSON.stringify({
      model: config.mistralModel,
      messages: [
        {
          role: "system",
          content:
            "Sos un ingeniero de software. Respondé en español, en 2-4 oraciones claras: " +
            "qué indica el log, si hay problemas graves, y qué revisar primero. " +
            "Si no hay errores detectados, decilo y sugerí revisar el contexto del archivo.",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
      max_tokens: 400,
      temperature: 0.4,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Mistral API ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content?.trim();
  return text || null;
}

module.exports = { generateInsight };
