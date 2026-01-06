
import React, { useState } from 'react';
import { ChatInterface } from './components/ChatInterface.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';
import { UserSettings, AgeRange, ResponseStyle, Gender } from './types.ts';

const App: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>({
    age: AgeRange.ADULT,
    style: ResponseStyle.LONG,
    advice: true,
    botGender: Gender.NEUTRAL,
    userGender: Gender.NEUTRAL,
    deepAnalysis: true
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen max-w-5xl mx-auto w-full relative">
      {/* Header */}
      <header className="flex justify-between items-center p-4 md:p-6 backdrop-blur-lg bg-slate-950/20 border-b border-white/5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-xl font-bold text-white">A</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">AuraMind <span className="text-cyan-400">R1</span></h1>
            <p className="text-[9px] mono text-slate-500 uppercase tracking-widest">Cognitive Analysis Node</p>
          </div>
        </div>
        
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-cyan-500/30 transition-all text-slate-400"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </button>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-hidden relative">
        <ChatInterface settings={settings} />
      </main>

      {/* Footer Info */}
      <footer className="hidden md:flex justify-center items-center py-2 space-x-4 opacity-30 pointer-events-none">
        <span className="text-[8px] mono uppercase tracking-widest">Thinking Engine: Active</span>
        <div className="w-1 h-1 bg-cyan-500 rounded-full"></div>
        <span className="text-[8px] mono uppercase tracking-widest">Privacy Secured</span>
      </footer>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        settings={settings} 
        setSettings={setSettings} 
      />
    </div>
  );
};

export default App;
