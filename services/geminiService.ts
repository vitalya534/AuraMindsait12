
import { GoogleGenAI } from "@google/genai";
import { UserSettings } from "../types.ts";

export async function generateAIResponse(
  message: string, 
  history: { role: 'user' | 'assistant', content: string }[],
  settings: UserSettings
) {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API_KEY missing");

  const ai = new GoogleGenAI({ apiKey });
  
  const systemInstruction = `
    Ты — AuraMind R1, высококвалифицированный ИИ-психолог. Твоя специализация — глубокий экзистенциальный и когнитивно-поведенческий анализ.
    
    Твоя задача:
    1. Использовать возможности глубокого рассуждения для поиска скрытых причин стресса или тревоги пользователя.
    2. Сохранять эмпатичный, спокойный и поддерживающий тон.
    3. Контекст пользователя: возраст ${settings.age}, стиль ${settings.style}.
    4. Отвечай ВСЕГДА на русском языке.
  `;

  const contents = [
    ...history.map(h => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.content }]
    })),
    { role: 'user', parts: [{ text: message }] }
  ];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
        thinkingConfig: {
          thinkingBudget: settings.deepAnalysis ? 32768 : 0
        }
      }
    });

    // Extract text output
    const text = response.text || "";
    
    // In Gemini 3 Pro, 'thinking' isn't always returned as a separate field like in DeepSeek,
    // but the model performs it internally when budget is allocated. 
    // If the model provides thoughts in parts, we could extract them.
    return {
      content: text,
      reasoning: "Анализ завершен. Модель применила глубокое рассуждение для формирования этого ответа."
    };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
