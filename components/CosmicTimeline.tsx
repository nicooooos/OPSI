import React, { useRef, useEffect, useState, useCallback } from 'react';
import { generateVisualizationCode } from '../services/geminiService';
import { SparklesIcon, ChatIcon } from './Icons';
import { LoadingIndicator } from './LoadingIndicator';
import { useTranslations } from '../contexts/LanguageContext';
import type { CosmicEvent } from '../i18n/translations';

const MAX_TIME = 13_800_000_000;
const LOG_MAX_TIME = Math.log10(MAX_TIME);

// Calculates Y position on a logarithmic scale
function getEventY(time: number, height: number, padding: number): number {
  if (time <= 1) return padding;
  const logTime = Math.log10(time);
  return padding + (logTime / LOG_MAX_TIME) * (height - padding * 2);
}

// Formats time into a readable string
function formatTime(time: number, t: any): string {
    if (time >= 1_000_000_000) {
        return `${(time / 1_000_000_000).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 })} ${t.timeUnitBillion} ${t.timeUnitYears}`;
    }
    if (time >= 1_000_000) {
        return `${(time / 1_000_000).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 })} ${t.timeUnitMillion} ${t.timeUnitYears}`;
    }
    if (time >= 1_000) {
        return `${(time / 1_000).toLocaleString()} ${t.timeUnitThousand} ${t.timeUnitYears}`;
    }
    return t.timeUnitYear1; // Special case for year 1
}

interface EventPosition {
  x: number;
  y: number;
  radius: number;
}

export const CosmicTimeline: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const visualizationSectionRef = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslations();
  const events = t.events;

  const [dims, setDims] = useState({ width: 0, height: 0 });
  const [selectedEvent, setSelectedEvent] = useState<CosmicEvent | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<CosmicEvent | null>(null);
  const eventPositions = useRef<Map<CosmicEvent, EventPosition>>(new Map());

  const [isGeneratingVis, setIsGeneratingVis] = useState(false);
  const [visualizationCode, setVisualizationCode] = useState<string | null>(null);
  const [visualizationError, setVisualizationError] = useState<string | null>(null);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  // New state for panning
  const [panOffsetY, setPanOffsetY] = useState(0);
  const panState = useRef({
    isPanning: false,
    didPan: false,
    startY: 0,
    startPanY: 0,
  });

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      if (entries?.[0]) {
        const { width } = entries[0].contentRect;
        // Increased height to give more room for collision avoidance
        const calculatedHeight = Math.max(events.length * 160, 950);
        setDims({ width, height: calculatedHeight });
      }
    });
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [events.length]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dims.width === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { width, height } = dims;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const padding = 60;
    const timelineX = width / 2;
    const baseUnit = width / 100;
    const eventRadius = Math.max(5, baseUnit * 0.8);
    const stemLength = Math.min(width * 0.3, 200);
    const labelFontSize = Math.max(12, baseUnit * 1.6);
    const yearFontSize = Math.max(10, baseUnit * 1.3);
    const minVerticalSeparation = labelFontSize + yearFontSize + 15;

    // --- Pass 1: Calculate initial positions and correct for overlaps ---
    const drawData = events.map((event, i) => {
        const y = getEventY(event.time, height, padding);
        const isLeft = i % 2 === 0;
        const x = timelineX + (isLeft ? -stemLength : stemLength);
        return { event, x, y, isLeft };
    });

    const leftEvents = drawData.filter(d => d.isLeft);
    const rightEvents = drawData.filter(d => d.isLeft === false);

    // Correct overlaps on each side separately
    [leftEvents, rightEvents].forEach(sideEvents => {
        for (let i = 1; i < sideEvents.length; i++) {
            const prevEvent = sideEvents[i - 1];
            const currentEvent = sideEvents[i];
            const requiredY = prevEvent.y + minVerticalSeparation;
            if (currentEvent.y < requiredY) {
                currentEvent.y = requiredY;
            }
        }
    });
    
    // Find the last event's Y position to draw the timeline correctly
    const lastEventY = Math.max(...drawData.map(d => d.y));

    // --- Pass 2: Draw everything using corrected positions ---
    ctx.beginPath();
    ctx.moveTo(timelineX, padding);
    ctx.lineTo(timelineX, lastEventY + eventRadius + padding/2);
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, '#67e8f9');
    gradient.addColorStop(0.5, '#a78bfa');
    gradient.addColorStop(1, '#f472b6');

    eventPositions.current.clear();
    drawData.forEach(({ event, x, y, isLeft }) => {
      eventPositions.current.set(event, { x, y, radius: eventRadius });

      // Draw stem
      ctx.beginPath();
      ctx.moveTo(timelineX, y);
      ctx.lineTo(x, y);
      ctx.strokeStyle = '#475569';
      ctx.stroke();
      
      // Draw event circle
      ctx.beginPath();
      ctx.arc(x, y, eventRadius, 0, Math.PI * 2);
      ctx.fillStyle = (selectedEvent === event || hoveredEvent === event) ? gradient : '#1e293b';
      ctx.strokeStyle = (selectedEvent === event || hoveredEvent === event) ? '#a78bfa' : '#67e8f9';
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();

      // Draw text
      const textX = x + (isLeft ? -eventRadius - 12 : eventRadius + 12);
      ctx.textAlign = isLeft ? 'right' : 'left';
      
      ctx.fillStyle = '#cbd5e1';
      ctx.font = `bold ${labelFontSize}px sans-serif`;
      ctx.textBaseline = 'bottom';
      ctx.fillText(event.name, textX, y - 2);
      
      ctx.fillStyle = '#94a3b8'; // slate-400
      ctx.font = `${yearFontSize}px sans-serif`;
      ctx.textBaseline = 'top';
      ctx.fillText(formatTime(event.time, t), textX, y + 2);
    });
  }, [dims, selectedEvent, hoveredEvent, events, t]);
  
  useEffect(() => {
    if (isGeneratingVis && selectedEvent?.funFacts.length) {
      const intervalId = setInterval(() => {
        setCurrentFactIndex(prev => (prev + 1) % selectedEvent.funFacts.length);
      }, 25000);
      return () => clearInterval(intervalId);
    }
  }, [isGeneratingVis, selectedEvent]);

  useEffect(() => {
    if (visualizationCode) {
      setTimeout(() => {
        visualizationSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [visualizationCode]);
  
  const handlePanStart = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.style.cursor = 'grabbing';
    
    panState.current.isPanning = true;
    panState.current.didPan = false;
    panState.current.startY = e.clientY;
    panState.current.startPanY = panOffsetY;
  }, [panOffsetY]);
  
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (panState.current.isPanning) {
        // Panning logic
        const deltaY = e.clientY - panState.current.startY;
        if (!panState.current.didPan && Math.abs(deltaY) > 5) {
            panState.current.didPan = true;
            setHoveredEvent(null); // Clear hover when panning starts
        }
        if (!panState.current.didPan) return;

        let newY = panState.current.startPanY + deltaY;

        const container = canvasContainerRef.current;
        if (container) {
            const containerHeight = container.clientHeight;
            const canvasHeight = dims.height;
            if (canvasHeight > containerHeight) {
                const minY = containerHeight - canvasHeight;
                const maxY = 0;
                newY = Math.max(minY, Math.min(newY, maxY));
            } else {
                newY = 0;
            }
        }
        setPanOffsetY(newY);
    } else {
        // Hover logic
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const transformedY = y - panOffsetY;

        let foundEvent: CosmicEvent | null = null;
        for (const [event, pos] of eventPositions.current.entries()) {
            if (Math.sqrt((x - pos.x) ** 2 + (transformedY - pos.y) ** 2) < pos.radius + 10) {
                foundEvent = event;
                break;
            }
        }
        setHoveredEvent(foundEvent);
        e.currentTarget.style.cursor = foundEvent ? 'pointer' : 'grab';
    }
  }, [dims.height, panOffsetY]);

  const handlePanEnd = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    panState.current.isPanning = false;
    e.currentTarget.style.cursor = hoveredEvent ? 'pointer' : 'grab';
    
    // If it wasn't a pan, it was a click.
    if (!panState.current.didPan) {
        // --- Execute Click Logic ---
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const transformedY = y - panOffsetY;

        let foundEvent: CosmicEvent | null = null;
        for (const [event, pos] of eventPositions.current.entries()) {
            if (Math.sqrt((x - pos.x) ** 2 + (transformedY - pos.y) ** 2) < pos.radius + 10) {
                foundEvent = event;
                break;
            }
        }
        
        const newSelectedEvent = selectedEvent === foundEvent ? null : foundEvent;
        setSelectedEvent(newSelectedEvent);
        
        if (selectedEvent !== newSelectedEvent) {
            setVisualizationCode(null);
            setVisualizationError(null);
            if (newSelectedEvent) {
                setTimeout(() => {
                    visualizationSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
        }
    }
  }, [selectedEvent, panOffsetY, hoveredEvent]);


  const handleGenerateVisualization = useCallback(async () => {
    if (!selectedEvent) return;

    setIsGeneratingVis(true);
    setVisualizationCode(null);
    setVisualizationError(null);
    setCurrentFactIndex(0);
    try {
      const code = await generateVisualizationCode(selectedEvent);
      setVisualizationCode(code);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : t.errorUnknownErrorMessage;
      if (errorMessage.toLowerCase().includes('api key not valid')) {
        setVisualizationError(t.errorAuthErrorMessage);
      } else {
        setVisualizationError(`${t.errorGenerationFailed} ${errorMessage}`);
      }
    } finally {
      setIsGeneratingVis(false);
    }
  }, [selectedEvent, t]);

  const handleScrollToChat = () => {
    document.getElementById('astrochat-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="text-center w-full" ref={containerRef}>
      <h1 className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-400 via-white to-slate-400 mb-4 tracking-widest bg-size-200 animate-text-shimmer drop-shadow-[0_0_8px_rgba(200,200,255,0.2)]">
        Time Traveller
      </h1>
      <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 text-transparent bg-clip-text mb-2 bg-[length:200%_auto] animate-gradient-flow">
        {t.timelineTitle}
      </h2>
      <p className="text-slate-400 mb-8 text-lg max-w-3xl mx-auto">
        {t.timelineSubtitle}
      </p>
      <div 
        ref={canvasContainerRef}
        className="w-full bg-slate-900/70 rounded-xl border-2 border-slate-700 shadow-2xl p-2 relative overflow-hidden h-[75vh] sm:h-auto"
        style={{ touchAction: 'pan-y', cursor: 'grab' }}
        onPointerDown={handlePanStart}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePanEnd}
        onPointerCancel={handlePanEnd}
        onPointerLeave={(e) => {
          if (!panState.current.isPanning) {
            setHoveredEvent(null);
            e.currentTarget.style.cursor = 'grab';
          }
        }}
        >
        <canvas 
          ref={canvasRef} 
          style={{ 
            width: dims.width, 
            height: dims.height, 
            display: 'block',
            transform: `translateY(${panOffsetY}px)`,
           }}
          aria-label={t.timelineAriaLabel}
          role="graphics-document"
        />
      </div>

      {selectedEvent && (
        <div className="mt-8 text-center animate-fade-in" ref={visualizationSectionRef}>
          <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-700 max-w-3xl mx-auto">
             <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-500 text-transparent bg-clip-text bg-[length:200%_auto] animate-gradient-flow">{selectedEvent.name}</h3>
             <p className="text-slate-300 mt-2">{selectedEvent.description}</p>
             
            {!visualizationCode && !isGeneratingVis && (
               <button
                onClick={handleGenerateVisualization}
                disabled={isGeneratingVis}
                className="group mt-6 inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-br from-cyan-500 to-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
              >
                <SparklesIcon />
                <span className="text-md font-semibold">{t.buttonGenerateVis}</span>
              </button>
             )}
          </div>
          
          {isGeneratingVis && (
             <div className="mt-6 flex flex-col items-center gap-4 text-cyan-300 max-w-2xl mx-auto">
                <LoadingIndicator />
                <p className="font-semibold text-lg">{t.visLoadingMessage.replace('{eventName}', selectedEvent.name)}</p>
                <p className="text-slate-400">{t.visFunFactMessage}</p>
                
                <div key={currentFactIndex} className="p-4 bg-slate-800/60 border border-slate-700 rounded-lg animate-fade-in text-center min-h-[80px] flex items-center justify-center">
                    <p className="italic text-slate-300">"{selectedEvent.funFacts[currentFactIndex]}"</p>
                </div>
    
                <button
                    onClick={handleScrollToChat}
                    className="relative group mt-8 inline-flex items-center gap-3 px-6 py-3 font-semibold rounded-xl text-slate-300 bg-slate-900 border-2 border-transparent bg-clip-padding before:content-[''] before:absolute before:inset-0 before:z-[-1] before:m-[-2px] before:rounded-xl before:bg-gradient-to-r before:from-pink-500 before:via-red-500 before:via-yellow-500 before:via-green-400 before:to-cyan-400 before:bg-[length:200%_auto] before:animate-gradient-flow-fast transition-transform transform hover:scale-105 group-hover:text-white"
                >
                    <ChatIcon />
                    <span>{t.buttonAskWhileWaiting}</span>
                </button>
             </div>
          )}

          {visualizationError && (
             <div className="mt-6 text-center text-red-400 p-4 bg-red-900/50 border border-red-700 rounded-lg max-w-3xl mx-auto">
                <h3 className="text-lg font-bold mb-2">{t.errorGenerationFailedTitle}</h3>
                <p>{visualizationError}</p>
            </div>
          )}

          {visualizationCode && (
            <div className="mt-8 animate-fade-in">
                <h3 className="text-2xl font-bold text-cyan-300 mb-4">{t.visResultTitle} {selectedEvent.name}</h3>
                <div className="w-full min-h-[50vh] max-h-[70vh] aspect-video bg-slate-900/70 rounded-xl border-2 border-slate-700 shadow-2xl p-2 relative overflow-hidden flex items-center justify-center mx-auto">
                    <iframe
                        srcDoc={visualizationCode}
                        title={`${t.visResultTitle} ${selectedEvent.name}`}
                        className="w-full h-full rounded-lg border-0"
                        sandbox="allow-scripts"
                    />
                </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
