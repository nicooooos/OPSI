import React, { useState, useEffect } from 'react';
import { PlayIcon } from './Icons';

const phases = [
  { name: 'The Big Bang & Inflation', explanation: 'From an infinitely dense point, the universe bursts forth. In a fraction of a second, it undergoes exponential inflation, stretching the fabric of spacetime.' },
  { name: 'The Cosmic Dark Ages', explanation: 'The universe cools, allowing atoms to form and making it transparent for the first time. For millions of years, it is dark, filled with neutral gas and the faint afterglow of creation (the Cosmic Microwave Background).' },
  { name: 'The First Stars Ignite', explanation: 'Gravity slowly gathers clouds of primordial gas. Under immense pressure, the very first stars ignite—massive, brilliant, and short-lived—ending the Cosmic Dark Ages.' },
  { name: 'Formation of Galaxies', explanation: 'These star clusters merge, forming the first protogalaxies. Over billions of years, collisions and mergers build the grand spiral and elliptical galaxies we see today.' },
  { name: 'Our Solar System Forms', explanation: 'Within a spiral arm of the Milky Way galaxy, a new star—our Sun—is born. A disk of gas and dust around it coalesces to form the planets, including our own Earth.' },
];


export const BigBangVisualizer: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);

    useEffect(() => {
        if (!isPlaying) return;

        let timerId: number;
        
        // If we are on any phase including the last one, we set a timer.
        if (currentPhaseIndex < phases.length - 1) {
            // For all but the last phase, the timer advances to the next phase.
            timerId = window.setTimeout(() => {
                setCurrentPhaseIndex(prevIndex => prevIndex + 1);
            }, 8000);
        } else {
            // For the last phase, the timer resets the whole component to the initial state.
            timerId = window.setTimeout(() => {
                setIsPlaying(false);
                setCurrentPhaseIndex(0);
            }, 8000);
        }

        return () => clearTimeout(timerId);
    }, [isPlaying, currentPhaseIndex]);
    
    const handleStartJourney = () => {
        setCurrentPhaseIndex(0);
        setIsPlaying(true);
    };

    const currentPhase = phases[currentPhaseIndex];
    const progressPercentage = isPlaying && currentPhase ? ((currentPhaseIndex + 1) / phases.length) * 100 : 0;

    return (
        <section className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 text-transparent bg-clip-text mb-2">
                The Big Bang: A Visual Journey
            </h1>
            <p className="text-slate-400 mb-8 text-lg max-w-3xl mx-auto">
                Witness the 13.8-billion-year history of our universe, from the first moments to the vast cosmos of today.
            </p>

            <div className="w-full max-w-4xl mx-auto aspect-video bg-slate-900/70 rounded-xl border-2 border-slate-700 shadow-2xl flex items-center justify-center p-2 relative overflow-hidden">
                {!isPlaying ? (
                     <button onClick={handleStartJourney} className="group flex flex-col items-center gap-4 text-cyan-300 hover:text-white transition-colors duration-300">
                        <div className="p-4 bg-slate-800 border-2 border-slate-600 rounded-full group-hover:border-cyan-500 group-hover:scale-110 transition-all duration-300">
                           <PlayIcon />
                        </div>
                        <span className="text-xl font-semibold">Start Journey</span>
                     </button>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-black rounded-lg overflow-hidden">
                        <iframe
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/Da9O4oFxVvI?autoplay=1&mute=1&loop=1&playlist=Da9O4oFxVvI&controls=0"
                            title="The Big Bang: A Visual Journey"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                )}
            </div>
            
            <div className="mt-6 w-full max-w-4xl mx-auto min-h-[160px]">
              {isPlaying && currentPhase && (
                  <div className="text-left bg-slate-800/50 p-6 rounded-xl border border-slate-700 animate-fade-in">
                      <div className="w-full bg-slate-700 rounded-full h-1.5 mb-4">
                          <div 
                              className="bg-gradient-to-r from-cyan-500 to-purple-500 h-1.5 rounded-full transition-all duration-500 ease-out" 
                              style={{ width: `${progressPercentage}%` }}>
                          </div>
                      </div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-purple-400 text-transparent bg-clip-text mb-2">
                          Phase {currentPhaseIndex + 1}: {currentPhase.name}
                      </h3>
                      <p className="text-slate-300 min-h-[60px]">
                          {currentPhase.explanation}
                      </p>
                  </div>
              )}
            </div>
        </section>
    );
};