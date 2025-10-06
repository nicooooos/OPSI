
import { MusicOnIcon } from "../components/Icons";

let audioContext: AudioContext | null = null;
let isPlaying = false;
let mainGain: GainNode | null = null;
let bassOsc: OscillatorNode | null = null;
let leadOsc: OscillatorNode | null = null;
let sequenceInterval: number | null = null;

type StateChangeListener = (isPlaying: boolean) => void;
const listeners: StateChangeListener[] = [];

// A simple, ambient note sequence (frequencies in Hz)
// C minor -> G minor -> Ab major -> Eb major progression
const noteSequence = [
  // Cmin7
  { note: 261.63, duration: 0.8, bass: 130.81 },
  { note: 311.13, duration: 0.8, bass: 130.81 },
  { note: 392.00, duration: 0.8, bass: 130.81 },
  { note: 311.13, duration: 0.8, bass: 130.81 },
  // Gmin7
  { note: 392.00, duration: 0.8, bass: 196.00 },
  { note: 466.16, duration: 0.8, bass: 196.00 },
  { note: 587.33, duration: 0.8, bass: 196.00 },
  { note: 466.16, duration: 0.8, bass: 196.00 },
   // Abmaj7
  { note: 415.30, duration: 0.8, bass: 207.65 },
  { note: 523.25, duration: 0.8, bass: 207.65 },
  { note: 622.25, duration: 0.8, bass: 207.65 },
  { note: 523.25, duration: 0.8, bass: 207.65 },
  // Ebmaj7
  { note: 311.13, duration: 0.8, bass: 155.56 },
  { note: 392.00, duration: 0.8, bass: 155.56 },
  { note: 523.25, duration: 0.8, bass: 155.56 },
  { note: 392.00, duration: 0.8, bass: 155.56 },
];
let currentNoteIndex = 0;

const getAudioContext = (): AudioContext | null => {
    if (typeof window !== 'undefined' && !audioContext) {
        try {
            audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        } catch (e) {
            console.error("Web Audio API is not supported in this browser.");
            return null;
        }
    }
    return audioContext;
};

const notifyListeners = () => {
  listeners.forEach(listener => listener(isPlaying));
};

const scheduleNextNote = () => {
    const ctx = getAudioContext();
    if (!ctx || !isPlaying || !mainGain || !bassOsc || !leadOsc) return;
    
    const { note, duration, bass } = noteSequence[currentNoteIndex];
    const now = ctx.currentTime;

    // Schedule lead note
    leadOsc.frequency.setValueAtTime(note, now);
    mainGain.gain.cancelScheduledValues(now);
    mainGain.gain.setValueAtTime(mainGain.gain.value, now); // Prevent clicks
    mainGain.gain.linearRampToValueAtTime(0.08, now + duration * 0.1);
    mainGain.gain.linearRampToValueAtTime(0, now + duration * 0.9);
    
    // Schedule bass note
    bassOsc.frequency.setValueAtTime(bass, now);

    currentNoteIndex = (currentNoteIndex + 1) % noteSequence.length;
};

const play = async () => {
    const ctx = getAudioContext();
    if (!ctx || isPlaying) return;

    if (ctx.state === 'suspended') {
        await ctx.resume();
    }
    
    isPlaying = true;

    // --- Setup Audio Nodes ---
    mainGain = ctx.createGain();
    mainGain.gain.setValueAtTime(0, ctx.currentTime);
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1200;

    // Lead Oscillator
    leadOsc = ctx.createOscillator();
    leadOsc.type = 'triangle';
    leadOsc.connect(filter);
    
    // Bass Oscillator
    bassOsc = ctx.createOscillator();
    bassOsc.type = 'sine';
    const bassGain = ctx.createGain();
    bassGain.gain.value = 0.12; // Bass is slightly louder but sine wave is less harsh
    bassOsc.connect(bassGain);
    bassGain.connect(ctx.destination);

    filter.connect(mainGain);
    mainGain.connect(ctx.destination);
    
    leadOsc.start();
    bassOsc.start();
    
    scheduleNextNote();
    const totalSequenceDuration = noteSequence.reduce((sum, item) => sum + item.duration, 0);
    sequenceInterval = window.setInterval(scheduleNextNote, noteSequence[0].duration * 1000);

    notifyListeners();
};

const pause = () => {
    if (!isPlaying || !audioContext) return;
    
    isPlaying = false;
    
    if (sequenceInterval) {
        clearInterval(sequenceInterval);
        sequenceInterval = null;
    }
    if (leadOsc) {
        leadOsc.stop();
        leadOsc = null;
    }
    if (bassOsc) {
        bassOsc.stop();
        bassOsc = null;
    }
    if (mainGain) {
        mainGain.disconnect();
        mainGain = null;
    }
    currentNoteIndex = 0;
    
    notifyListeners();
};

const toggle = () => {
    if (isPlaying) {
        pause();
    } else {
        play();
    }
};

const subscribe = (listener: StateChangeListener) => {
    listeners.push(listener);
};

const unsubscribe = (listener: StateChangeListener) => {
    const index = listeners.indexOf(listener);
    if (index > -1) {
        listeners.splice(index, 1);
    }
};

export const backgroundMusicService = {
    play,
    pause,
    toggle,
    subscribe,
    unsubscribe,
};
