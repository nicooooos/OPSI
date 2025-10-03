
import React, { useRef, useEffect, useState } from 'react';

// --- Data for the Timeline ---
interface CosmicEvent {
  time: number; // Years after Big Bang
  name: string;
  description: string;
}

const events: CosmicEvent[] = [
  { time: 1, name: 'The Big Bang', description: 'The universe begins from an infinitely hot, dense point and undergoes rapid inflation, creating spacetime.' },
  { time: 380_000, name: 'Recombination', description: 'The universe cools enough for protons and electrons to form neutral hydrogen atoms, making the cosmos transparent to light for the first time.' },
  { time: 400_000_000, name: 'First Stars Ignite', description: 'Gravity collapses clouds of hydrogen and helium gas, igniting the first generation of massive, brilliant stars, ending the Cosmic Dark Ages.' },
  { time: 1_000_000_000, name: 'Galaxy Formation', description: 'Early stars and gas clouds merge under gravity, forming the first protogalaxies. These structures continue to collide and grow over billions of years.' },
  { time: 9_000_000_000, name: 'Solar System Forms', description: 'Within a spiral arm of the Milky Way, a cloud of gas and dust collapses to form our Sun. A surrounding disk of material coalesces into planets, including Earth.' },
  { time: 10_000_000_000, name: 'First Life on Earth', description: 'Simple, single-celled organisms emerge in Earth\'s primordial oceans, marking the beginning of biology.' },
  { time: 13_800_000_000, name: 'Present Day', description: 'After 13.8 billion years of cosmic evolution, the universe is filled with complex structures, galaxies, stars, planets, and at least one world teeming with life.' },
];

const MAX_TIME = 13_800_000_000;
const LOG_MAX_TIME = Math.log10(MAX_TIME);

// --- Helper Functions for Canvas Drawing ---

// Wraps text to fit within a specified width on the canvas
function wrapText(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ');
  let line = '';
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
}

// Calculates X position on a logarithmic scale
function getEventX(time: number, width: number, padding: number): number {
  if (time <= 1) return padding;
  const logTime = Math.log10(time);
  return padding + (logTime / LOG_MAX_TIME) * (width - padding * 2);
}

// --- The React Component ---

export const CosmicTimeline: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dims, setDims] = useState({ width: 0, height: 0 });
  const [selectedEvent, setSelectedEvent] = useState<CosmicEvent | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<CosmicEvent | null>(null);
  const eventPositions = useRef<Map<CosmicEvent, { x: number, y: number, radius: number }>>(new Map());

  // Effect for handling resize
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      if (entries && entries.length > 0) {
        const { width } = entries[0].contentRect;
        // A fixed aspect ratio for the canvas content
        setDims({ width, height: Math.min(width * 0.4, 450) });
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
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { width, height } = dims;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.clearRect(0, 0, width, height);

    // --- Drawing constants based on canvas size ---
    const padding = width * 0.05;
    const timelineY = height / 2;
    const eventRadius = Math.max(5, width * 0.007);
    const baseStemHeight = height * 0.1;

    // --- Draw Timeline Axis ---
    ctx.beginPath();
    ctx.moveTo(padding, timelineY);
    ctx.lineTo(width - padding, timelineY);
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
      const x = getEventX(event.time, width, padding);
      
      // Stagger stem heights to prevent label overlap
      const isTop = i % 2 === 0;
      // Stagger pairs of events: (0,1) are short, (2,3) are long, (4,5) are short, etc.
      const isLongStem = Math.floor(i / 2) % 2 !== 0; 
      const currentStemHeight = isLongStem ? baseStemHeight * 1.6 : baseStemHeight;
      const y = timelineY + (isTop ? -currentStemHeight : currentStemHeight);
      
      eventPositions.current.set(event, { x, y, radius: eventRadius });

      // Stem
      ctx.beginPath();
      ctx.moveTo(x, timelineY);
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
      ctx.font = `bold ${Math.max(12, width * 0.012)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = (isTop) ? 'bottom' : 'top';
      ctx.fillText(event.name, x, y + (isTop ? -eventRadius - 5 : eventRadius + 5));
    });

    // --- Draw Selected Event Info Box ---
    if (selectedEvent) {
      const boxWidth = Math.min(width * 0.8, 400);
      const boxHeight = height * 0.4;
      const boxX = (width - boxWidth) / 2;
      const boxY = timelineY - boxHeight / 2;
      const textPadding = 20;

      ctx.fillStyle = 'rgba(30, 41, 59, 0.9)'; // slate-800 with alpha
      ctx.strokeStyle = '#67e8f9'; // cyan-300
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 10);
      ctx.fill();
      ctx.stroke();
      
      // Title
      ctx.fillStyle = gradient;
      ctx.font = `bold ${Math.max(16, width * 0.015)}px sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(selectedEvent.name, boxX + textPadding, boxY + textPadding);

      // Description
      ctx.fillStyle = '#cbd5e1'; // slate-300
      ctx.font = `${Math.max(13, width * 0.012)}px sans-serif`;
      const lineHeight = Math.max(18, width * 0.018);
      wrapText(ctx, selectedEvent.description, boxX + textPadding, boxY + textPadding + 30, boxWidth - textPadding * 2, lineHeight);
    }

  }, [dims, selectedEvent, hoveredEvent]);
  
  // --- Interactivity Handlers ---
  const handleCanvasInteraction = (e: React.MouseEvent<HTMLCanvasElement>, isClick: boolean) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let foundEvent = null;
    for (const [event, pos] of eventPositions.current.entries()) {
      const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
      if (distance < pos.radius + 5) { // Add padding for easier clicking
        foundEvent = event;
        break;
      }
    }
    
    if (isClick) {
      // If clicking the currently selected event, deselect it. Otherwise, select the new one.
      setSelectedEvent(prev => (prev === foundEvent ? null : foundEvent));
    } else {
      setHoveredEvent(foundEvent);
      canvas.style.cursor = foundEvent ? 'pointer' : 'default';
    }
  };


  return (
    <section className="text-center w-full" ref={containerRef}>
      <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 text-transparent bg-clip-text mb-2">
        A Journey Through Cosmic Time
      </h2>
      <p className="text-slate-400 mb-8 text-lg max-w-3xl mx-auto">
        Explore 13.8 billion years of history, from the first moments of the universe to today. Click on an event to learn more.
      </p>
      <div className="w-full bg-slate-900/70 rounded-xl border-2 border-slate-700 shadow-2xl p-2 relative overflow-hidden">
        <canvas 
          ref={canvasRef} 
          style={{ width: '100%', height: '100%', display: 'block' }}
          onClick={(e) => handleCanvasInteraction(e, true)}
          onMouseMove={(e) => handleCanvasInteraction(e, false)}
          onMouseLeave={() => setHoveredEvent(null)}
          aria-label="Interactive cosmic timeline"
          role="graphics-document"
        />
      </div>
    </section>
  );
};
