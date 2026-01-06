
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserSettings } from '../types.ts';
import { generateAIResponse } from '../services/geminiService.ts';

interface ChatInterfaceProps {
  settings: UserSettings;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ settings }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ 
        role: m.role, 
        content: m.content 
      }));
      
      const response = await generateAIResponse(input, history, settings);
      
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        reasoning: settings.deepAnalysis ? response.reasoning : undefined,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error: any) {
      console.error(error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: `Извините, возникла ошибка связи с аналитическим ядром: ${error.message}. Пожалуйста, убедитесь, что API ключ активен.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full"></div>
              <div className="relative w-24 h-24 border border-cyan-500/30 rounded-full flex items-center justify-center bg-slate-900/50 backdrop-blur-xl">
                <span className="text-4xl">🧠</span>
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-white">Добро пожаловать в AuraMind</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Я — ваше пространство для размышлений. Расскажите мне о том, что вас беспокоит, и мы вместе найдем путь к равновесию.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {['Чувствую тревогу', 'Проблемы на работе', 'Личные отношения'].map(topic => (
                <button 
                  key={topic}
                  onClick={() => setInput(topic)}
                  className="px-4 py-2 bg-slate-800/50 border border-slate-700 hover:border-cyan-500/50 rounded-full text-xs text-slate-300 transition-all"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start animate-fade-in'}`}>
            <div className={`max-w-[85%] px-6 py-4 rounded-3xl shadow-2xl backdrop-blur-md ${
              msg.role === 'user' 
                ? 'bg-cyan-600/20 border border-cyan-500/30 text-white rounded-tr-none' 
                : 'bg-slate-800/40 border border-slate-700/50 text-slate-200 rounded-tl-none'
            }`}>
              {msg.role === 'assistant' && msg.reasoning && (
                <div className="mb-3 pb-3 border-b border-white/5">
                   <div className="flex items-center space-x-2 text-[10px] mono text-cyan-400/60 uppercase tracking-widest mb-1">
                      <div className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse"></div>
                      <span>Deep Reasoning Active</span>
                   </div>
                   <p className="text-[11px] italic text-slate-500 leading-snug">{msg.reasoning}</p>
                </div>
              )}
              <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              <span className="text-[10px] block mt-3 opacity-20 mono text-right">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex flex-col items-start space-y-4">
             <div className="flex items-center space-x-3 px-4 py-2 bg-slate-800/30 border border-slate-700/50 rounded-full">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"></div>
                </div>
                <span className="mono text-[10px] text-cyan-400 uppercase tracking-widest">Анализирую ситуацию...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      <div className="p-6 bg-slate-950/50 backdrop-blur-2xl border-t border-white/5">
        <div className="max-w-4xl mx-auto relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="О чем вы думаете сейчас?.."
            className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-6 pr-16 text-sm text-slate-100 focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-600 shadow-inner"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-white p-3 rounded-xl transition-all active:scale-95 shadow-lg disabled:shadow-none disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
