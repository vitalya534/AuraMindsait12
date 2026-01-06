
import React, { useState } from 'react';
import { ChatInterface } from './components/ChatInterface';
import { SettingsModal } from './components/SettingsModal';
import { PremiumModal } from './components/PremiumModal';
import { UserSettings, AgeRange, ResponseStyle, Gender, PremiumState } from './types';

const App: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>({
    age: AgeRange.ADULT,
    style: ResponseStyle.LONG,
    advice: true,
    botGender: Gender.NEUTRAL,
    userGender: Gender.NEUTRAL,
    deepAnalysis: true
  });

  const [premium, setPremium] = useState<PremiumState>({
    isPremium: true,
    key: "DEEPSEEK-ULTRA"
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-100 flex flex-col items-center justify-center p-2 md:p-6">
      {/* DeepSeek Branding Header */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-6 px-4">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-cyan-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <span className="text-xl font-black italic">D</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">AuraMind <span className="text-cyan-500">R1</span></h1>
            <p className="text-[10px] mono text-gray-500 uppercase tracking-widest">DeepSeek Analytical Psychology</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
           <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2.5 rounded-xl bg-[#161b22] border border-white/5 hover:border-cyan-500/30 text-gray-400 hover:text-cyan-400 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </button>
        </div>
      </div>

      {/* Main Interface Container */}
      <div className="w-full max-w-5xl bg-[#0d1117] border border-white/5 rounded-[2rem] shadow-2xl flex flex-col h-[85vh] overflow-hidden">
        <ChatInterface settings={settings} />
      </div>

      {/* Footer Info */}
      <div className="mt-4 flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
          <span className="text-[10px] mono text-gray-500 uppercase">Latency: 240ms</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
          <span className="text-[10px] mono text-gray-500 uppercase">Model: deepseek-reasoner</span>
        </div>
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        settings={settings} 
        setSettings={setSettings} 
      />
      <PremiumModal 
        isOpen={isPremiumOpen} 
        onClose={() => setIsPremiumOpen(false)} 
        premium={premium} 
        setPremium={setPremium} 
      />
    </div>
  );
};

export default App;
