
import { UserSettings } from "../types";

export async function generateDeepSeekResponse(
  message: string, 
  history: { role: 'user' | 'assistant', content: string }[],
  settings: UserSettings
) {
  const API_KEY = process.env.API_KEY;
  const ENDPOINT = "https://api.deepseek.com/chat/completions";

  const systemPrompt = `
    You are AuraMind, a professional AI psychologist powered by DeepSeek-R1.
    Your goal is to provide deep, analytical, and empathetic psychological support.
    
    User Context:
    - Age: ${settings.age}
    - Style: ${settings.style === 'short' ? 'Concise' : 'Detailed & Exploratory'}
    - Advice: ${settings.advice ? 'Active' : 'Socratic Method Only'}
    
    Instructions:
    1. Use your reasoning capabilities to analyze the user's underlying emotions.
    2. Be supportive and maintain professional boundaries.
    3. Speak in Russian.
  `;

  const messages = [
    { role: "system", content: systemPrompt },
    ...history,
    { role: "user", content: message }
  ];

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: "deepseek-reasoner",
      messages: messages,
      temperature: 0.6,
      max_tokens: 4000
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "DeepSeek API Error");
  }

  const data = await response.json();
  const choice = data.choices[0].message;

  return {
    content: choice.content,
    reasoning: choice.reasoning_content // Specific to DeepSeek-R1
  };
}
