
import { GoogleGenAI } from "@google/genai";
import { UserSettings } from "../types";

export async function generateAIResponse(
  message: string, 
  history: { role: 'user' | 'model', text: string }[],
  settings: UserSettings
) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const now = new Date();
  const dateStr = now.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  
  const systemInstruction = `
    Ты — AuraMind DeepReasoning, ИИ-психолог нового поколения, построенный на принципах глубокого логического вывода (аналог DeepSeek R1).
    
    Твой метод работы:
    1. Глубокое рассуждение: Ты всегда начинаешь с внутреннего анализа. Ты не просто отвечаешь, ты исследуешь корень проблемы.
    2. Аналитический подход: Твои ответы должны быть структурированными, эмпатичными, но профессиональными.
    
    Параметры пользователя:
    - Возраст: ${settings.age}
    - Стиль ответов: ${settings.style === 'short' ? 'лаконичный и точный' : 'развернутый, с глубоким погружением'}
    - Давать советы: ${settings.advice ? 'активно предлагать пути решения' : 'использовать только метод сократического диалога'}
    
    Дата: ${dateStr}.
    Используй свои ресурсы мышления (thinking budget) на максимум, чтобы найти скрытые паттерны в поведении пользователя.
  `;

  // Используем Gemini 3 Pro с максимальным бюджетом на рассуждение (32k), что является аналогом DeepSeek R1
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [
      ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
      { role: 'user', parts: [{ text: message }] }
    ],
    config: {
      systemInstruction,
      temperature: 0.5, // Снижаем температуру для более строгого следования логике
      thinkingConfig: {
        thinkingBudget: settings.deepAnalysis ? 32768 : 0 // Максимальный бюджет для глубоких рассуждений
      }
    }
  });

  return response.text || "Аналитический модуль не смог завершить операцию. Попробуйте еще раз.";
}
