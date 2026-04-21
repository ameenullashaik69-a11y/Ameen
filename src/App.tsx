/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame.tsx';
import MusicPlayer from './components/MusicPlayer.tsx';
import { motion } from 'motion/react';
import { Zap, Cpu, Activity, LayoutGrid } from 'lucide-react';

export default function App() {
  return (
    <div className="w-full h-screen flex flex-col p-6 gap-6 bg-[#050505] overflow-hidden">
      {/* Background Ambience - Simplified per theme */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-neon-cyan/5 blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-neon-pink/5 blur-[150px]" />
      </div>

      <header className="flex justify-between items-center glass-panel p-4 rounded-xl">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-[#39FF14] animate-pulse shadow-[0_0_8px_#39FF14]"></div>
          <h1 className="text-2xl font-bold tracking-tighter neon-cyan">SYNTH-SNAKE <span className="text-xs font-normal opacity-50 ml-2">v2.0.4</span></h1>
        </div>
        <div className="flex gap-8">
          {/* Note: I'll move score state to a context or keep it in components, but for layout visibility: */}
          <div className="text-center">
            <div className="text-[10px] opacity-50 uppercase tracking-widest text-[#e0e0e0]">Active Unit</div>
            <div className="text-sm font-bold opacity-80 uppercase tracking-widest">System Ready</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] opacity-50 uppercase tracking-widest text-[#e0e0e0]">Neural Sync</div>
            <div className="text-sm font-bold neon-green uppercase tracking-widest">Optimized</div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex gap-6 overflow-hidden">
        {/* Sidebar - Music Player */}
        <div className="w-80 flex flex-col gap-6">
          <MusicPlayer />
        </div>

        {/* Game Area */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          <SnakeGame />
        </div>
      </main>

      <footer className="flex justify-between text-[10px] opacity-30 uppercase tracking-[0.3em] px-2 font-mono">
        <span>AI Studio Proto-Labs // Geometric Balance Logic</span>
        <span>Neural-Symmetry Engaged</span>
      </footer>
    </div>
  );
}
