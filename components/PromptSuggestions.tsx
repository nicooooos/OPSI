import React from 'react';

interface PromptSuggestionsProps {
  onPromptClick: (prompt: string) => void;
}

const suggestions = [
  "What is a black hole?",
  "Tell me about the James Webb Telescope.",
  "How are stars born?",
  "Explain dark matter in simple terms.",
];

export const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({ onPromptClick }) => {
  return (
    <div className="w-full max-w-xl lg:max-w-3xl mx-auto p-4 animate-fade-in mt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {suggestions.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onPromptClick(prompt)}
            className="p-3 bg-slate-800/80 border border-slate-700 rounded-lg text-left text-slate-300 hover:bg-slate-700 hover:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200 text-sm"
            aria-label={`Ask: ${prompt}`}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};
