
import React from 'react';
import { BackIcon } from './Icons';
import { useTranslations } from '../contexts/LanguageContext';

interface HeaderProps {
    onBack: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onBack }) => {
  const { t } = useTranslations();
  return (
    <header className="relative text-center p-4 z-10 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center">
      <button 
        onClick={onBack}
        className="absolute left-4 p-2 text-slate-400 hover:text-white transition-colors duration-200 rounded-full hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        aria-label="Change level"
        title="Change Level"
      >
        <BackIcon />
      </button>
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 text-transparent bg-clip-text">
          AstroChat AI
        </h1>
        <p className="text-slate-400 text-sm">{t.headerSubtitle}</p>
      </div>
    </header>
  );
};