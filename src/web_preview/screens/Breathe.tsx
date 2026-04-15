import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { PhoneFrame } from '../components/PhoneFrame';
import { StatusBar } from '../components/StatusBar';
import { motion, AnimatePresence } from 'motion/react';

type Phase = 'inhale' | 'hold' | 'exhale';

const phases: Array<{ phase: Phase; duration: number; count: number }> = [
  { phase: 'inhale', duration: 4, count: 4 },
  { phase: 'hold', duration: 7, count: 7 },
  { phase: 'exhale', duration: 8, count: 8 },
];

export function Breathe() {
  const navigate = useNavigate();
  const [currentPhase, setCurrentPhase] = useState(0);
  const [count, setCount] = useState(4);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const phaseData = phases[currentPhase];
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          const nextPhase = (currentPhase + 1) % phases.length;
          setCurrentPhase(nextPhase);
          setProgress((p) => Math.min(p + 5, 100));
          return phases[nextPhase].count;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentPhase]);

  const currentPhaseData = phases[currentPhase];
  const scale = currentPhaseData.phase === 'inhale' ? 1.1 : currentPhaseData.phase === 'hold' ? 1.05 : 0.95;

  return (
    <PhoneFrame>
      <StatusBar />

      <div className="px-6 pt-20 flex flex-col h-full">
        <button onClick={() => navigate('/home')} className="text-[13px] text-[var(--n-500)] mb-8">
          ← end early
        </button>

        <div className="flex-1 flex flex-col items-center justify-center -mt-20">
          <p className="text-[11px] font-medium text-[var(--n-400)] mb-8 tracking-wider">
            BREATHE — 2 MIN
          </p>

          <div className="relative w-56 h-56 flex items-center justify-center mb-12">
            <motion.div
              animate={{ scale }}
              transition={{ duration: 1, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full bg-[var(--brand-extra-light)] border-2 border-[var(--brand-light)]"
            />

            <motion.div
              animate={{ scale: scale * 0.7 }}
              transition={{ duration: 1, ease: 'easeInOut' }}
              className="absolute inset-12 rounded-full bg-white border-2 border-[var(--brand)]"
            />

            <div className="relative z-10 text-center">
              <p className="text-[17px] font-semibold text-[var(--n-900)] mb-2">
                {currentPhaseData.phase}
              </p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={count}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-[32px] font-bold text-[var(--brand)]"
                >
                  {count}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          <p className="text-[13px] text-[var(--n-500)] text-center mb-8">
            {currentPhaseData.phase === 'inhale' && 'breathe in slowly through your nose'}
            {currentPhaseData.phase === 'hold' && 'hold this breath gently'}
            {currentPhaseData.phase === 'exhale' && 'breathe out slowly through your mouth'}
          </p>

          <div className="flex items-center gap-3 mb-6">
            {phases.map((p, i) => (
              <div key={p.phase} className="text-center">
                <div
                  className={`w-2 h-2 rounded-full mb-1 ${
                    i === currentPhase ? 'bg-[var(--n-900)]' : 'bg-[var(--n-300)]'
                  }`}
                />
                <p className="text-[9px] text-[var(--n-400)]">{p.phase}</p>
              </div>
            ))}
          </div>

          <div className="w-[270px] h-[3px] bg-[var(--n-200)] rounded-full overflow-hidden mb-4">
            <motion.div
              animate={{ width: `${progress}%` }}
              className="h-full bg-[var(--brand)] rounded-full"
            />
          </div>

          <button
            onClick={() => navigate('/home')}
            className="px-8 py-2 bg-white border border-[var(--n-300)] rounded-lg text-xs font-medium text-[var(--n-600)]"
          >
            end early
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
}
