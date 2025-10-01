
import React, { useState } from 'react';
import { SendIcon } from './Icons';

interface InputBarProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export const InputBar: React.FC<InputBarProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask about stars, planets, galaxies..."
        className="flex-1 p-3 bg-slate-800 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="p-3 bg-gradient-to-br from-cyan-500 to-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
      >
        <SendIcon />
      </button>
    </form>
  );
};
