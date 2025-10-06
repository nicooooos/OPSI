let audioContext: AudioContext | null = null;

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

const playSound = (type: 'send' | 'clear' | 'select') => {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
        ctx.resume();
    }

    const now = ctx.currentTime;
    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);

    if (type === 'send') {
        const oscillator = ctx.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, now);
        oscillator.frequency.linearRampToValueAtTime(880, now + 0.1);
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
        oscillator.connect(gainNode);
        oscillator.start(now);
        oscillator.stop(now + 0.1);
    } else if (type === 'clear') {
        const noiseSource = ctx.createBufferSource();
        const bufferSize = ctx.sampleRate * 0.3;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        noiseSource.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, now);
        filter.frequency.linearRampToValueAtTime(100, now + 0.3);

        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

        noiseSource.connect(filter);
        filter.connect(gainNode);
        noiseSource.start(now);
        noiseSource.stop(now + 0.3);
    } else if (type === 'select') {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = 'triangle';
        osc2.type = 'sine';

        osc1.frequency.setValueAtTime(523.25, now); // C5
        osc2.frequency.setValueAtTime(783.99, now); // G5

        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.4);
        osc2.stop(now + 0.4);
    }
};

export const audioService = {
    playSendSound: () => playSound('send'),
    playClearSound: () => playSound('clear'),
    playSelectSound: () => playSound('select'),
};
