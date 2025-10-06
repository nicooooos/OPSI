
import React, { useState, useEffect } from 'react';
import { backgroundMusicService } from '../services/backgroundMusicService';
import { MusicOnIcon, MusicOffIcon } from './Icons';

export const MusicToggleButton: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const handleStateChange = (newIsPlayingState: boolean) => {
      setIsPlaying(newIsPlayingState);
    };

    backgroundMusicService.subscribe(handleStateChange);

    return () => {
      backgroundMusicService.unsubscribe(handleStateChange);
    };
  }, []);

  return (
    <button
      onClick={backgroundMusicService.toggle}
      className="p-2 text-slate-400 hover:text-white transition-colors duration-200 rounded-full hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      aria-label={isPlaying ? 'Pause background music' : 'Play background music'}
      title={isPlaying ? 'Pause Music' : 'Play Music'}
    >
      {isPlaying ? <MusicOnIcon /> : <MusicOffIcon />}
    </button>
  );
};
