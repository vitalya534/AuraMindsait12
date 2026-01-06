
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserSettings } from '../types';
import { generateDeepSeekResponse } from '../services/aiService';

interface ChatInterfaceProps {
  settings: UserSettings;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ settings }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedReasoning, setExpandedReasoning] = useState<string | null>(null);
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
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const { content, reasoning } = await generateDeepSeekResponse(input, history, settings);
      
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: content,
        reasoning: reasoning,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error: any) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Ошибка API DeepSeek: ${error.message}. Убедитесь, что ваш API ключ активен.`,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1117]">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-30">
            <div className="w-16 h-16 border-2 border-cyan-500/30 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-cyan-500/40 rounded-full animate-pulse"></div>
            </div>
            <p className="mono text-[10px] tracking-[0.4em] text-cyan-400">DEEPSEEK_R1_READY</p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            {/* Reasoning Block for Assistant */}
            {msg.role === 'assistant' && msg.reasoning && (
              <div className="mb-2 w-full max-w-[90%]">
                <details className="group">
                  <summary className="list-none cursor-pointer flex items-center space-x-2 text-[10px] mono text-cyan-500/60 hover:text-cyan-400 transition-colors uppercase tracking-widest bg-cyan-500/5 px-3 py-1.5 rounded-lg border border-cyan-500/10">
                    <svg className={`w-3 h-3 transition-transform group-open:rotate-90`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
                    </svg>
                    <span>Внутренний анализ (Reasoning)</span>
                  </summary>
                  <div className="mt-2 p-4 text-[11px] mono text-gray-400 bg-white/[0.02] border-l-2 border-cyan-500/30 rounded-r-xl leading-relaxed whitespace-pre-wrap">
                    {msg.reasoning}
                  </div>
                </details>
              </div>
            )}

            <div className={`max-w-[90%] px-5 py-3 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-cyan-600 text-white rounded-tr-none shadow-[0_0_20px_rgba(6,182,212,0.2)]' 
                : 'bg-[#161b22] border border-white/5 text-gray-200 rounded-tl-none'
            }`}>
              <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              <span className="text-[9px] block mt-2 opacity-30 mono text-right">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex flex-col items-start space-y-3">
             <div className="flex items-center space-x-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping"></div>
                <span className="mono text-[9px] text-cyan-400 uppercase tracking-tighter">Thinking by DeepSeek-R1...</span>
             </div>
             <div className="bg-[#161b22] border border-white/5 rounded-2xl rounded-tl-none p-4 w-4/5 animate-pulse">
                <div className="h-2 bg-white/10 rounded w-full mb-2"></div>
                <div className="h-2 bg-white/10 rounded w-2/3"></div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-[#0d1117] border-t border-white/5">
        <div className="max-w-4xl mx-auto relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Введите ваше сообщение..."
            className="w-full bg-[#161b22] border border-white/10 rounded-xl py-3.5 pl-5 pr-14 text-sm text-gray-200 focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-gray-600"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-800 text-white p-2 rounded-lg transition-all active:scale-90"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-center text-[9px] text-gray-600 mt-2 mono uppercase tracking-widest">Powered by DeepSeek Neuro-Engine</p>
      </div>
    </div>
  );
};
