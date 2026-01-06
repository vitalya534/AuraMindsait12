
import { GoogleGenAI } from "@google/genai";
import { UserSettings } from "../types.ts";

export async function generateAIResponse(
  message: string, 
  history: { role: 'user' | 'assistant', content: string }[],
  settings: UserSettings
) {
  const apiKey = process?.env?.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY не обнаружен. Пожалуйста, проверьте настройки окружения.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const systemInstruction = `
    Ты — AuraMind R1, профессиональный ИИ-психолог. 
    Твоя цель: глубокий аналитический и эмпатичный разбор ситуаций.
    
    Стиль общения:
    1. Тон спокойный, вдумчивый, профессиональный.
    2. Используй глубокое рассуждение (Deep Thinking) для анализа подтекста и эмоций.
    3. Возраст пользователя: ${settings.age}.
    4. Если активированы советы (${settings.advice}), предлагай конкретные шаги. Если нет — используй метод Сократа.
    5. Ответ всегда на русском языке.
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
        temperature: 0.65,
        thinkingConfig: {
          thinkingBudget: settings.deepAnalysis ? 32768 : 0
        }
      }
    });

    const text = response.text || "Извините, я не смог сформировать ответ.";
    
    return {
      content: text,
      reasoning: settings.deepAnalysis ? "Проведен глубокий психологический анализ когнитивных паттернов." : undefined
    };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
