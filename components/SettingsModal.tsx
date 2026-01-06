
import React from 'react';
import { UserSettings, AgeRange, ResponseStyle, Gender } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  setSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, setSettings }) => {
  if (!isOpen) return null;

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-indigo-950/60 backdrop-blur-md">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/20">
        <div className="p-8 bg-indigo-600 flex justify-between items-center text-white">
          <div>
            <h2 className="text-2xl font-bold flex items-center">
              <span className="mr-3 text-3xl">⚙️</span> Конфигурация
            </h2>
            <p className="text-indigo-100 text-xs mt-1">Настройте параметры психологического анализа</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8 overflow-y-auto space-y-8">
          {/* Deep Analysis Toggle */}
          <div className="bg-indigo-50 p-4 rounded-3xl border border-indigo-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-xl">🧪</span>
                <span className="text-sm font-bold text-indigo-900">Глубокое рассуждение</span>
              </div>
              <button
                onClick={() => updateSetting('deepAnalysis', !settings.deepAnalysis)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.deepAnalysis ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.deepAnalysis ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            <p className="text-[10px] text-indigo-600/70 leading-relaxed">
              Активирует режим "Thinking" (аналог DeepSeek R1). Модель будет тратить больше времени на раздумья для предоставления сверхточного психологического анализа.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Возраст</label>
              <select
                value={settings.age}
                onChange={(e) => updateSetting('age', e.target.value as AgeRange)}
                className="w-full bg-gray-50 border-gray-100 rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-indigo-500 appearance-none shadow-inner"
              >
                <option value={AgeRange.TEEN}>Подросток</option>
                <option value={AgeRange.ADULT}>Взрослый</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Стиль</label>
              <select
                value={settings.style}
                onChange={(e) => updateSetting('style', e.target.value as ResponseStyle)}
                className="w-full bg-gray-50 border-gray-100 rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-indigo-500 appearance-none shadow-inner"
              >
                <option value={ResponseStyle.SHORT}>Краткий</option>
                <option value={ResponseStyle.LONG}>Глубокий</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <span className="text-sm font-bold text-gray-700">Давать прямые советы</span>
            <button
              onClick={() => updateSetting('advice', !settings.advice)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.advice ? 'bg-indigo-600' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.advice ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>

        <div className="p-8 bg-gray-50 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-3xl transition-all shadow-xl shadow-indigo-100 active:scale-[0.98]"
          >
            Применить изменения
          </button>
        </div>
      </div>
    </div>
  );
};
