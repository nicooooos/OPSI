import React, { useRef, useEffect, useState, useCallback } from 'react';
import { generateVisualizationCode } from '../services/geminiService';
import { SparklesIcon } from './Icons';
import { LoadingIndicator } from './LoadingIndicator';


// --- Data for the Timeline ---
export interface CosmicEvent {
  time: number; // Years after Big Bang
  name: string;
  description: string;
}

const events: CosmicEvent[] = [
  { time: 1, name: 'The Big Bang', description: 'The universe erupts from a singularity of infinite density. A period of exponential \'inflation\' occurs, expanding spacetime faster than light and laying the foundation for all future structures.' },
  { time: 380_000, name: 'Recombination', description: 'Roughly 380,000 years later, the universe cools sufficiently for electrons and protons to combine into the first neutral atoms (mostly hydrogen). This allows photons to travel freely for the first time, creating the Cosmic Microwave Background radiation we can still detect today.' },
  { time: 400_000_000, name: 'First Stars Ignite', description: 'Gravity pulls vast clouds of primordial gas together until they collapse, triggering nuclear fusion in their cores. This ignites the very first stars, which are massive, incredibly bright, and short-lived, ending the Cosmic Dark Ages.' },
  { time: 1_000_000_000, name: 'Galaxy Formation', description: 'The immense gravity of dark matter halos, combined with the gravitational pull of star clusters, begins to draw in more gas and stars. These materials merge and collide, forming the earliest protogalaxies, the building blocks of the grand galaxies we see today.' },
  { time: 9_000_000_000, name: 'Solar System Forms', description: 'Within a spiral arm of the burgeoning Milky Way galaxy, a giant molecular cloud collapses. At its center, our Sun is born. A swirling protoplanetary disk of leftover gas and dust around the young star gradually coalesces into the planets, moons, and asteroids of our Solar System.' },
  { time: 10_000_000_000, name: 'First Life on Earth', description: 'On the young, volatile Earth, in its primordial oceans or perhaps hydrothermal vents, simple organic molecules assemble into self-replicating structures. These single-celled organisms, the first life, begin a multi-billion-year evolutionary journey.' },
  { time: 13_800_000_000, name: 'Present Day', description: 'After 13.8 billion years of expansion and evolution, the universe is a vast cosmic web of galaxies, stars, and dark matter. On a small, rocky planet called Earth, humanity has emerged, capable of looking back and piecing together this grand cosmic story.' },
];

const MAX_TIME = 13_800_000_000;
const LOG_MAX_TIME = Math.log10(MAX_TIME);

// Calculates Y position on a logarithmic scale for a vertical timeline
function getEventY(time: number, height: number, padding: number): number {
  if (time <= 1) return padding;
  const logTime = Math.log10(time);
  return padding + (logTime / LOG_MAX_TIME) * (height - padding * 2);
}

// --- The React Component ---

export const CosmicTimeline: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const visualizationSectionRef = useRef<HTMLDivElement | null>(null);
  const [dims, setDims] = useState({ width: 0, height: 0 });
  const [selectedEvent, setSelectedEvent] = useState<CosmicEvent | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<CosmicEvent | null>(null);
  const eventPositions = useRef<Map<CosmicEvent, { x: number, y: number, radius: number }>>(new Map());

  // State for AI visualization
  const [isGeneratingVis, setIsGeneratingVis] = useState(false);
  const [visualizationCode, setVisualizationCode] = useState<string | null>(null);
  const [visualizationError, setVisualizationError] = useState<string | null>(null);


  // Effect for handling resize
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      if (entries && entries.length > 0) {
        const { width } = entries[0].contentRect;
        // Height is calculated based on number of events for a vertical layout
        const calculatedHeight = Math.max(events.length * 130, 800);
        setDims({ width, height: calculatedHeight });
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // Effect for drawing the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dims.width === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { width, height } = dims;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.clearRect(0, 0, width, height);

    // --- Drawing constants based on canvas size ---
    const padding = 50;
    const timelineX = width / 2;
    const baseUnit = width / 100;

    // Enhanced proportional scaling for better legibility across screen sizes.
    // Radii and font sizes now scale more dynamically with the canvas width.
    const eventRadius = Math.max(5, baseUnit * 0.8);
    const stemLength = Math.min(width * 0.25, 150);
    const labelFontSize = Math.max(12, baseUnit * 1.6);

    // --- Draw Timeline Axis ---
    ctx.beginPath();
    ctx.moveTo(timelineX, padding);
    ctx.lineTo(timelineX, height - padding);
    ctx.strokeStyle = '#475569'; // slate-600
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Gradient for markers
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, '#67e8f9'); // cyan-300
    gradient.addColorStop(0.5, '#a78bfa'); // violet-400
    gradient.addColorStop(1, '#f472b6'); // pink-400

    // --- Draw Events ---
    eventPositions.current.clear();
    events.forEach((event, i) => {
      const y = getEventY(event.time, height, padding);
      
      const isLeft = i % 2 === 0;
      const x = timelineX + (isLeft ? -stemLength : stemLength);
      
      eventPositions.current.set(event, { x, y, radius: eventRadius });

      // Stem
      ctx.beginPath();
      ctx.moveTo(timelineX, y);
      ctx.lineTo(x, y);
      ctx.strokeStyle = '#475569'; // slate-600
      ctx.stroke();
      
      // Marker Circle
      ctx.beginPath();
      ctx.arc(x, y, eventRadius, 0, Math.PI * 2);
      ctx.fillStyle = (selectedEvent === event || hoveredEvent === event) ? gradient : '#1e293b'; // slate-800
      ctx.strokeStyle = (selectedEvent === event || hoveredEvent === event) ? '#a78bfa' : '#67e8f9'; // violet-400 or cyan-300
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();

      // Label
      ctx.fillStyle = '#cbd5e1'; // slate-300
      ctx.font = `bold ${labelFontSize}px sans-serif`;
      ctx.textAlign = isLeft ? 'right' : 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(event.name, x + (isLeft ? -eventRadius - 10 : eventRadius + 10), y);
    });
  }, [dims, selectedEvent, hoveredEvent]);
  
  // --- Interactivity Handlers ---
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let foundEvent = null;
    for (const [event, pos] of eventPositions.current.entries()) {
      const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
      if (distance < pos.radius + 10) { // Add padding for easier clicking
        foundEvent = event;
        break;
      }
    }
    
    // If clicking the currently selected event, deselect it. Otherwise, select new one.
    const newSelectedEvent = selectedEvent === foundEvent ? null : foundEvent;
    setSelectedEvent(newSelectedEvent);
    
    // Reset visualization if selection changes
    if (selectedEvent !== newSelectedEvent) {
        setVisualizationCode(null);
        setVisualizationError(null);
        // Scroll to the visualization section if a new event is selected
        if (newSelectedEvent) {
             // A timeout gives the DOM time to render the section before scrolling
            setTimeout(() => {
                visualizationSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
     const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let foundEvent = null;
    for (const [event, pos] of eventPositions.current.entries()) {
      const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
      if (distance < pos.radius + 10) {
        foundEvent = event;
        break;
      }
    }
    setHoveredEvent(foundEvent);
    canvas.style.cursor = foundEvent ? 'pointer' : 'default';
  };

  const handleGenerateVisualization = useCallback(async () => {
    if (!selectedEvent) return;

    setIsGeneratingVis(true);
    setVisualizationCode(null);
    setVisualizationError(null);
    try {
      const code = await generateVisualizationCode(selectedEvent);
      setVisualizationCode(code);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      if (errorMessage.toLowerCase().includes('api key not valid')) {
        setVisualizationError('Your Gemini API key appears to be invalid or has expired. Please check your credentials.');
      } else {
        setVisualizationError(`The AI failed to generate the visualization. Error: ${errorMessage}`);
      }
    } finally {
      setIsGeneratingVis(false);
    }
  }, [selectedEvent]);


  return (
    <section className="text-center w-full" ref={containerRef}>
      <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 text-transparent bg-clip-text mb-2">
        A Journey Through Cosmic Time
      </h2>
      <p className="text-slate-400 mb-8 text-lg max-w-3xl mx-auto">
        Explore 13.8 billion years of history. Click on an event to learn more and generate a unique AI visualization.
      </p>
      <div className="w-full bg-slate-900/70 rounded-xl border-2 border-slate-700 shadow-2xl p-2 relative overflow-hidden">
        <canvas 
          ref={canvasRef} 
          style={{ width: dims.width, height: dims.height, display: 'block' }}
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMouseMove}
          onMouseLeave={() => setHoveredEvent(null)}
          aria-label="Interactive vertical cosmic timeline"
          role="graphics-document"
        />
      </div>

      {/* --- AI Visualization Section --- */}
      {selectedEvent && (
        <div className="mt-8 text-center animate-fade-in" ref={visualizationSectionRef}>
          <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-700 max-w-3xl mx-auto">
             <h3 className="text-2xl font-bold text-cyan-300">{selectedEvent.name}</h3>
             <p className="text-slate-300 mt-2">{selectedEvent.description}</p>
             
            {!visualizationCode && !isGeneratingVis && (
               <button
                onClick={handleGenerateVisualization}
                disabled={isGeneratingVis}
                className="group mt-6 inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-br from-cyan-500 to-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
              >
                <SparklesIcon />
                <span className="text-md font-semibold">Generate Visualization</span>
              </button>
             )}
          </div>
          
          {isGeneratingVis && (
             <div className="mt-6 flex flex-col items-center gap-4 text-cyan-300">
                <LoadingIndicator />
                <p>Asking the AI to visualize "{selectedEvent.name}"...</p>
             </div>
          )}

          {visualizationError && (
             <div className="mt-6 text-center text-red-400 p-4 bg-red-900/50 border border-red-700 rounded-lg max-w-3xl mx-auto">
                <h3 className="text-lg font-bold mb-2">Generation Failed</h3>
                <p>{visualizationError}</p>
            </div>
          )}

          {visualizationCode && (
            <div className="mt-8 animate-fade-in">
                <h3 className="text-2xl font-bold text-cyan-300 mb-4">AI Visualization: {selectedEvent.name}</h3>
                <div className="w-full min-h-[50vh] max-h-[70vh] aspect-video bg-slate-900/70 rounded-xl border-2 border-slate-700 shadow-2xl p-2 relative overflow-hidden flex items-center justify-center mx-auto">
                    <iframe
                        srcDoc={visualizationCode}
                        title={`AI Generated Visualization for ${selectedEvent.name}`}
                        className="w-full h-full rounded-lg border-0"
                        sandbox="allow-scripts" // Security: restrict iframe capabilities but allow scripts to run
                    />
                </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};