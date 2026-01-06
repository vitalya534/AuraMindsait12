
import { UserSettings } from "../types.ts";

export async function generateDeepSeekResponse(
  message: string, 
  history: { role: 'user' | 'assistant', content: string }[],
  settings: UserSettings
) {
  // Use window.process shim if normal process isn't available
  const env = (window as any).process?.env || {};
  const API_KEY = env.API_KEY || (typeof process !== 'undefined' ? process.env.API_KEY : "");

  if (!API_KEY) {
    throw new Error("API_KEY не настроен. Добавьте его в системные переменные.");
  }

  const ENDPOINT = "https://api.deepseek.com/chat/completions";

  const systemPrompt = `
    Ты AuraMind, профессиональный психолог на базе DeepSeek-R1.
    Твоя цель — глубокий аналитический и эмпатичный разбор ситуаций.
    
    Контекст пользователя:
    - Возраст: ${settings.age}
    - Стиль: ${settings.style === 'short' ? 'Лаконичный' : 'Подробный и исследовательский'}
    - Советы: ${settings.advice ? 'Активно предлагать решения' : 'Только сократический диалог'}
    
    Инструкции:
    1. Используй свои способности к рассуждению (reasoning) для анализа подтекста.
    2. Будь поддерживающим, но профессиональным.
    3. Отвечай ТОЛЬКО на русском языке.
  `;

  const messages = [
    { role: "system", content: systemPrompt },
    ...history.map(h => ({ role: h.role, content: h.content })),
    { role: "user", content: message }
  ];

  try {
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
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Ошибка API: ${response.status}`);
    }

    const data = await response.json();
    const choice = data.choices[0].message;

    return {
      content: choice.content,
      reasoning: choice.reasoning_content
    };
  } catch (error: any) {
    console.error("DeepSeek API Error:", error);
    throw error;
  }
}
