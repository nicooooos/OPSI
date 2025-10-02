
import React from 'react';
import { CloseIcon } from './Icons';
import { LoadingIndicator } from './LoadingIndicator';

interface VisualizationModalProps {
  isOpen: boolean;
  isLoading: boolean;
  imageUrl: string | null;
  error: string | null;
  onClose: () => void;
}

export const VisualizationModal: React.FC<VisualizationModalProps> = ({ isOpen, isLoading, imageUrl, error, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in-fast-modal"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="relative bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-4xl aspect-video flex items-center justify-center p-4"
        onClick={e => e.stopPropagation()} // Prevent closing modal when clicking inside
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 text-slate-400 hover:text-white transition-colors duration-200 rounded-full hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          aria-label="Close visualization"
        >
          <CloseIcon />
        </button>

        {isLoading && (
          <div className="flex flex-col items-center gap-4 text-cyan-300">
            <LoadingIndicator />
            <p>Conjuring a cosmic vision...</p>
          </div>
        )}
        
        {error && (
            <div className="text-center text-red-400">
                <h3 className="text-lg font-bold mb-2">A Cosmic Anomaly Occurred</h3>
                <p>Could not generate the visualization. Please try again.</p>
                <p className="text-xs mt-2 text-slate-500">{error}</p>
            </div>
        )}

        {imageUrl && (
            <img 
                src={imageUrl} 
                alt="AI-generated visualization of the astronomical concept" 
                className="object-contain w-full h-full rounded-lg animate-fade-in"
            />
        )}
      </div>
    </div>
  );
};