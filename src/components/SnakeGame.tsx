import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Play, RefreshCw } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const SPEED = 100;

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Don't spawn food on snake body
      const onSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || !gameStarted) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Eat food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, gameStarted, generateFood, score, highScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction.y === 0) setDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': if (direction.y === 0) setDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': if (direction.x === 0) setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': if (direction.x === 0) setDirection({ x: 1, y: 0 }); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      gameLoopRef.current = setInterval(moveSnake, SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameStarted, gameOver, moveSnake]);

  return (
    <div className="flex-1 glass-panel rounded-2xl p-6 relative flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full flex justify-between items-center mb-6 px-4">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.2em] opacity-40">Local Score</span>
          <span className="text-3xl font-bold neon-green tabular-nums">{score.toLocaleString()}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-[0.2em] opacity-40">Session Max</span>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-neon-pink" />
            <span className="text-xl font-bold opacity-80 tabular-nums">{highScore.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div 
        className="relative bg-black/40 border border-white/5 rounded-lg overflow-hidden shadow-2xl"
        style={{ width: GRID_SIZE * 20, height: GRID_SIZE * 20 }}
      >
        {/* Game Grid */}
        <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 opacity-20 pointer-events-none">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-white/5" />
          ))}
        </div>

        {/* Snake */}
        {snake.map((segment, i) => (
          <motion.div
            key={`${i}-${segment.x}-${segment.y}`}
            initial={false}
            animate={{ 
              left: segment.x * 20, 
              top: segment.y * 20,
            }}
            className={`absolute w-[18px] h-[18px] m-[1px] rounded-sm z-20 shadow-neon-green`}
            style={{ backgroundColor: '#39FF14' }}
          />
        ))}

        {/* Food */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="absolute w-[16px] h-[16px] m-[2px] bg-neon-pink rounded-full z-10 shadow-neon-pink"
          style={{ left: food.x * 20, top: food.y * 20 }}
        />

        {/* Overlays */}
        <AnimatePresence>
          {!gameStarted && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-6 text-center p-8"
            >
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold text-white uppercase tracking-[0.2em]">System Initialization</h2>
                <div className="h-px w-24 bg-neon-cyan mx-auto shadow-neon-cyan" />
              </div>
              <p className="text-slate-400 text-[10px] uppercase tracking-widest max-w-[240px]">Navigate the grid. Optimized for JetBrains mono synthesis.</p>
              <button 
                onClick={resetGame}
                className="group relative px-10 py-3 border border-neon-cyan text-neon-cyan text-xs font-bold uppercase tracking-widest overflow-hidden transition-all hover:bg-neon-cyan hover:text-black"
              >
                Start Interface
              </button>
            </motion.div>
          )}

          {gameOver && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md z-40 flex flex-col items-center justify-center gap-4 border border-neon-pink/20"
            >
              <span className="text-neon-pink text-[10px] uppercase font-bold tracking-[0.4em] animate-pulse">Interface Terminated</span>
              <h2 className="text-4xl font-bold text-white uppercase italic tracking-tighter">DESYNC</h2>
              <div className="flex flex-col items-center gap-1 mt-2">
                <span className="text-[10px] uppercase opacity-40">Sync Result</span>
                <span className="text-2xl font-bold neon-green uppercase">{score}</span>
              </div>
              <button 
                onClick={resetGame}
                className="mt-4 px-8 py-2 border border-white/20 text-white hover:border-white transition-all text-[10px] uppercase tracking-widest font-bold"
              >
                Re-Initialize
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls Display */}
      <div className="mt-8 flex gap-3">
        <div className="flex flex-col items-center gap-2">
           <div className="flex gap-2">
             <kbd className="w-10 h-10 flex items-center justify-center glass-panel rounded-lg text-xs opacity-50 border-white/5">W</kbd>
           </div>
           <div className="flex gap-2">
             <kbd className="w-10 h-10 flex items-center justify-center glass-panel rounded-lg text-xs opacity-50 border-white/5">A</kbd>
             <kbd className="w-10 h-10 flex items-center justify-center glass-panel rounded-lg text-xs opacity-50 border-white/5">S</kbd>
             <kbd className="w-10 h-10 flex items-center justify-center glass-panel rounded-lg text-xs opacity-50 border-white/5">D</kbd>
           </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}} />
    </div>
  );
}
