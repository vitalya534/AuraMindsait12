
import { GoogleGenAI } from "@google/genai";
import { UserSettings, AgeRange } from "../types.ts";

export async function generateAIResponse(
  message: string, 
  history: { role: 'user' | 'assistant', content: string }[],
  settings: UserSettings
) {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY не обнаружен. Пожалуйста, убедитесь, что ключ настроен в окружении.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const systemInstruction = `
    Ты — AuraMind R1, высококвалифицированный ИИ-психолог с глубоким пониманием когнитивных процессов.
    Твоя цель: помочь пользователю разобраться в своих чувствах, используя эмпатию и научный подход.
    
    ПАРАМЕТРЫ ТВОЕЙ ЛИЧНОСТИ:
    - Тон: Спокойный, поддерживающий, немного аналитический.
    - Возраст пользователя: ${settings.age}. Учитывай это в лексике.
    - Стиль: ${settings.style === 'short' ? 'Лаконичный и точный' : 'Глубокий и развернутый'}.
    - Формат: ${settings.advice ? 'Активно предлагай практические упражнения и советы.' : 'Используй метод Сократа, задавай наводящие вопросы.'}
    
    ИНСТРУКЦИИ:
    1. Если включен Deep Analysis (thinking budget > 0), проводи глубокий разбор скрытых эмоций.
    2. Всегда отвечай на русском языке.
    3. Не используй типичные фразы-клише ИИ, будь более человечным.
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
          thinkingBudget: settings.deepAnalysis ? 16000 : 0
        }
      }
    });

    const text = response.text || "Извини, произошла ошибка в обработке мыслей. Попробуй еще раз.";
    
    return {
      content: text,
      reasoning: settings.deepAnalysis ? "Проведен экзистенциальный и когнитивный анализ состояния." : undefined
    };
  } catch (error: any) {
    console.error("Gemini SDK Error:", error);
    throw error;
  }
}
