
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

  const handleSend = async (forcedInput?: string) => {
    const textToSend = forcedInput || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
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
      
      const response = await generateAIResponse(textToSend, history, settings);
      
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        reasoning: response.reasoning,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error: any) {
      console.error(error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: `Ошибка: ${error.message}. Попробуйте обновить страницу или проверить соединение.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-8 max-w-md mx-auto animate-fade-in">
            <div className="relative group">
              <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full group-hover:bg-cyan-500/30 transition-all duration-1000"></div>
              <div className="relative w-28 h-28 border border-cyan-500/30 rounded-[2.5rem] flex items-center justify-center bg-slate-900/40 backdrop-blur-3xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                <span className="text-5xl">🧘‍♂️</span>
              </div>
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-white tracking-tight">AuraMind <span className="text-cyan-400">R1</span></h2>
              <p className="text-slate-400 text-sm leading-relaxed px-4">
                Ваш персональный аналитик и проводник к ментальному спокойствию. О чем вы хотите поговорить?
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 px-4">
              {['Тревога без причины', 'Выгорание на работе', 'Личные границы'].map(topic => (
                <button 
                  key={topic}
                  onClick={() => handleSend(topic)}
                  className="px-5 py-2.5 bg-slate-800/40 border border-slate-700/50 hover:border-cyan-500/50 hover:bg-slate-800/60 rounded-2xl text-xs font-medium text-slate-300 transition-all active:scale-95"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-fade-in`}>
            <div className={`max-w-[90%] md:max-w-[75%] px-6 py-4 rounded-[2rem] shadow-2xl backdrop-blur-xl ${
              msg.role === 'user' 
                ? 'bg-cyan-600/20 border border-cyan-500/30 text-white rounded-tr-none' 
                : 'bg-slate-800/40 border border-slate-700/50 text-slate-200 rounded-tl-none'
            }`}>
              {msg.role === 'assistant' && msg.reasoning && (
                <div className="mb-4 pb-4 border-b border-white/5">
                   <div className="flex items-center space-x-2 text-[10px] mono text-cyan-400/80 uppercase tracking-widest mb-2 font-bold">
                      <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></div>
                      <span>Deep Reasoning Active</span>
                   </div>
                   <p className="text-[11px] italic text-slate-500 leading-snug">{msg.reasoning}</p>
                </div>
              )}
              <div className="text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium">
                {msg.content}
              </div>
              <div className="flex items-center justify-end mt-3 space-x-2 opacity-30">
                <span className="text-[9px] mono uppercase">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex flex-col items-start space-y-4 animate-fade-in">
             <div className="flex items-center space-x-3 px-6 py-3 bg-slate-800/40 border border-slate-700/50 rounded-full backdrop-blur-xl">
                <div className="flex space-x-1.5">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
                </div>
                <span className="mono text-[10px] text-cyan-400 font-bold uppercase tracking-[0.2em]">Thinking...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-10" />
      </div>

      <div className="p-6 bg-slate-950/40 backdrop-blur-3xl border-t border-white/5">
        <div className="max-w-4xl mx-auto relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="О чем вы думаете сейчас?.."
            className="w-full bg-slate-900/60 border border-white/10 rounded-[1.8rem] py-5 pl-7 pr-20 text-sm text-slate-100 focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-600 shadow-2xl"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-white p-3.5 rounded-[1.3rem] transition-all active:scale-90 shadow-lg disabled:shadow-none disabled:opacity-40"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <p className="text-center mt-4 text-[9px] text-slate-600 mono uppercase tracking-widest">
          End-to-end encrypted session
        </p>
      </div>
    </div>
  );
};
