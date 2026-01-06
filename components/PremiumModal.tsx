
import React, { useState } from 'react';
import { PremiumState } from '../types';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  premium: PremiumState;
  setPremium: React.Dispatch<React.SetStateAction<PremiumState>>;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose, premium, setPremium }) => {
  const [inputKey, setInputKey] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleActivate = () => {
    // In a real app, this would check against a backend.
    // Here we'll simulate a key verification.
    if (inputKey.length >= 8) {
      setPremium({ isPremium: true, key: inputKey });
      onClose();
    } else {
      setError('Неверный ключ активации');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 text-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-indigo-300 hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-white/10 rounded-full mb-4">
            <span className="text-4xl">✨</span>
          </div>
          <h2 className="text-2xl font-bold">AuraMind Premium</h2>
          <p className="text-indigo-200 mt-2">Разблокируйте все возможности своего ИИ-психолога</p>
        </div>

        <div className="space-y-4 mb-8">
          {[
            'Приоритетный доступ к Gemini 3',
            'Неограниченное количество сообщений',
            'Глубокий анализ эмоций',
            'Отсутствие рекламы'
          ].map((feature, i) => (
            <div key={i} className="flex items-center space-x-3 text-sm">
              <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>{feature}</span>
            </div>
          ))}
        </div>

        {premium.isPremium ? (
          <div className="bg-white/10 rounded-2xl p-4 text-center">
            <p className="text-indigo-200 font-semibold mb-1">У вас активен Premium!</p>
            <p className="text-xs opacity-60">Ключ: {premium.key}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Введите ключ активации..."
              value={inputKey}
              onChange={(e) => {
                setInputKey(e.target.value);
                setError('');
              }}
              className="w-full bg-white/10 border border-white/20 rounded-2xl py-3 px-4 text-center focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
            />
            {error && <p className="text-red-400 text-xs text-center">{error}</p>}
            <button
              onClick={handleActivate}
              className="w-full bg-white text-indigo-900 font-bold py-3 rounded-2xl hover:bg-indigo-50 transition-all shadow-lg"
            >
              Активировать
            </button>
            <p className="text-[10px] text-center text-indigo-300 opacity-60">
              Купите ключ у администратора бота AuraMind
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
