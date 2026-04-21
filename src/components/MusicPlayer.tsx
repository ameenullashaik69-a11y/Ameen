import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music2, Disc } from 'lucide-react';

interface Song {
  id: number;
  title: string;
  artist: string;
  url: string;
  color: string;
  duration: number;
}

const DUMMY_SONGS: Song[] = [
  {
    id: 1,
    title: "Neon Dreams",
    artist: "SynthAI Voyager",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "#ff00ff",
    duration: 180
  },
  {
    id: 2,
    title: "Cybernetic Pulse",
    artist: "Neural Network",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "#00ffff",
    duration: 210
  },
  {
    id: 3,
    title: "Vapor Echo",
    artist: "Binary Beats",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "#39ff14",
    duration: 155
  }
];

export default function MusicPlayer() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSong = DUMMY_SONGS[currentSongIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.log("Audio play blocked", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentSongIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const p = (audio.currentTime / audio.duration) * 100;
      setProgress(isNaN(p) ? 0 : p);
    };

    const handleEnded = () => {
      skipForward();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSongIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipForward = () => {
    setCurrentSongIndex((prev) => (prev + 1) % DUMMY_SONGS.length);
    setProgress(0);
  };

  const skipBack = () => {
    setCurrentSongIndex((prev) => (prev - 1 + DUMMY_SONGS.length) % DUMMY_SONGS.length);
    setProgress(0);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
      setProgress(newProgress);
    }
  };

  return (
    <div className="glass-panel flex-1 rounded-2xl p-5 flex flex-col relative overflow-hidden">
      <h2 className="text-[10px] uppercase tracking-[0.3em] opacity-40 mb-6">Neural Audio Protocol</h2>
      
      <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-indigo-950 via-slate-900 to-black mb-6 flex items-center justify-center relative overflow-hidden shadow-2xl border border-white/5 group">
        <motion.div 
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-20 flex items-center justify-center"
        >
          <div className="w-[120%] h-[120%] border-[1px] border-neon-cyan/20 rounded-full scale-110" />
          <div className="w-[100%] h-[100%] border-[1px] border-neon-pink/20 rounded-full" />
        </motion.div>
        
        <div className="absolute inset-0 flex items-center justify-center">
           <motion.div 
             animate={{ 
               scale: isPlaying ? [1, 1.05, 1] : 1,
               opacity: isPlaying ? [0.4, 0.6, 0.4] : 0.2
             }}
             transition={{ duration: 2, repeat: Infinity }}
             className="w-32 h-32 rounded-full blur-2xl"
             style={{ backgroundColor: currentSong.color }}
           />
        </div>

        <div className="z-10 text-center flex flex-col items-center gap-2">
          <div className={`text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-white/10 glass-panel shadow-neon-cyan animate-pulse`}>
            {isPlaying ? 'Streaming' : 'Buffered'}
          </div>
          <Disc className={`w-12 h-12 text-white/20 ${isPlaying ? 'animate-spin' : ''}`} />
        </div>
      </div>

      <div className="mb-6 h-20">
        <motion.h3 
          key={currentSong.title}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-xl font-bold truncate tracking-tight text-white"
        >
          {currentSong.title}
        </motion.h3>
        <motion.p 
          key={currentSong.artist}
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 0.5 }}
          className="text-xs uppercase tracking-widest font-bold mt-1"
        >
          {currentSong.artist}
        </motion.p>
      </div>

      <div className="flex items-center justify-between mb-2">
        <button onClick={skipBack} className="opacity-40 hover:opacity-100 transition-opacity hover:neon-cyan">
          <SkipBack className="w-5 h-5" />
        </button>
        <button 
          onClick={togglePlay}
          className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center text-2xl hover:scale-105 active:scale-95 transition-transform shadow-xl"
        >
          {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current translate-x-0.5" />}
        </button>
        <button onClick={skipForward} className="opacity-40 hover:opacity-100 transition-opacity hover:neon-cyan">
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-auto w-full">
        <div className="w-full h-1 bg-white/5 rounded-full relative overflow-hidden">
          <motion.div 
            className="absolute left-0 top-0 h-full bg-neon-cyan shadow-neon-cyan"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] mt-2 opacity-30 font-bold tabular-nums">
          <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
          <span>{formatTime(audioRef.current?.duration || 0)}</span>
        </div>
      </div>

      <audio 
        ref={audioRef} 
        src={currentSong.url} 
        preload="auto"
      />
    </div>
  );
}

function formatTime(seconds: number): string {
  if (isNaN(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
