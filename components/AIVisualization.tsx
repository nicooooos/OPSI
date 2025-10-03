
import React, { useState, useCallback } from 'react';
import { generateVisualizationCode } from '../services/geminiService';
import { SparklesIcon } from './Icons';
import { LoadingIndicator } from './LoadingIndicator';

export const AIVisualization: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedCode(null);
    try {
      const code = await generateVisualizationCode();
      setGeneratedCode(code);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      if (errorMessage.toLowerCase().includes('api key not valid')) {
        setError('Your Gemini API key appears to be invalid or has expired. Please check your credentials.');
      } else {
        setError(`The AI failed to generate the visualization. Error: ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <section className="text-center w-full">
      <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 text-transparent bg-clip-text mb-2">
        AI-Generated Big Bang
      </h1>
      <p className="text-slate-400 mb-8 text-lg max-w-3xl mx-auto">
        Click the button to ask Gemini to generate a unique, real-time code visualization of the universe's origin.
      </p>

      <div className="w-full min-h-[50vh] max-h-[70vh] aspect-video bg-slate-900/70 rounded-xl border-2 border-slate-700 shadow-2xl p-2 relative overflow-hidden flex items-center justify-center mx-auto">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4 text-cyan-300">
            <LoadingIndicator />
            <p>Asking the AI to write visualization code...</p>
            <p className="text-sm text-slate-500">(This may take a moment)</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-400 p-4">
            <h3 className="text-lg font-bold mb-2">Generation Failed</h3>
            <p className="max-w-md">{error}</p>
          </div>
        ) : generatedCode ? (
          <iframe
            srcDoc={generatedCode}
            title="AI Generated Big Bang Visualization"
            className="w-full h-full rounded-lg border-0"
            sandbox="allow-scripts" // Security: restrict iframe capabilities but allow scripts to run
          />
        ) : (
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-br from-cyan-500 to-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
          >
            <SparklesIcon />
            <span className="text-lg font-semibold">Generate Visualization</span>
          </button>
        )}
      </div>
    </section>
  );
};
