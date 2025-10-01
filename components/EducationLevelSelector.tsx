
import React from 'react';
import type { EducationLevel } from '../types';

interface EducationLevelSelectorProps {
  onSelectLevel: (level: EducationLevel) => void;
}

const levels: { name: EducationLevel, description: string }[] = [
    { name: 'Elementary', description: 'Simple explanations & fun facts' },
    { name: 'High School', description: 'Clear concepts for students' },
    { name: 'Intermediate', description: 'In-depth, technical answers' },
];


export const EducationLevelSelector: React.FC<EducationLevelSelectorProps> = ({ onSelectLevel }) => {
  return (
    <div className="z-10 flex flex-col items-center justify-center h-full text-white animate-fade-in p-4">
      <div className="text-center w-full max-w-2xl p-8 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700 shadow-2xl">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 text-transparent bg-clip-text mb-2">
          Welcome to AstroChat AI
        </h1>
        <p className="text-slate-400 mb-8 text-base sm:text-lg">Select your knowledge level to begin your cosmic journey.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {levels.map(({ name, description }) => (
            <button
              key={name}
              onClick={() => onSelectLevel(name)}
              className="group p-6 bg-slate-800 border-2 border-slate-700 rounded-lg text-lg font-semibold text-white placeholder-slate-500 hover:bg-slate-700 hover:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center justify-center text-center"
            >
              <span className="text-xl">{name}</span>
              <span className="text-xs text-slate-400 font-normal mt-1 group-hover:text-cyan-300 transition-colors">{description}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
