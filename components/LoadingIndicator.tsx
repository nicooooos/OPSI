
import React from 'react';

export const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex items-center space-x-2 p-4 bg-slate-800 rounded-xl">
      <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
      <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
    </div>
  );
};
