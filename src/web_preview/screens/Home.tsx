import { useState } from 'react';
import { useNavigate } from 'react-router';
import { PhoneFrame } from '../components/PhoneFrame';
import { StatusBar } from '../components/StatusBar';
import { useMoodFlow } from '../context/MoodFlowContext';
import { Music } from 'lucide-react';
import { motion } from 'motion/react';

export function Home() {
  const navigate = useNavigate();
  const { checkIns, currentIntention, streak } = useMoodFlow();
  const [showCheckIn, setShowCheckIn] = useState(false);

  const todayCheckIns = checkIns.filter((c) => {
    const today = new Date().toDateString();
    return c.time.toDateString() === today;
  });

  const lastCheckIn = checkIns[0];

  const getMoodColor = (mood: string) => {
    const colors: Record<string, string> = {
      great: 'var(--mood-great)',
      good: 'var(--brand)',
      okay: 'var(--warning)',
      low: 'var(--danger)',
      rough: 'var(--mood-rough)',
    };
    return colors[mood] || 'var(--brand)';
  };

  return (
    <PhoneFrame>
      <StatusBar />

      <div className="px-6 pt-20 pb-24">
        <div className="flex items-start justify-between mb-2">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-[var(--n-900)]"
            >
              good morning
            </motion.h1>
            <p className="text-[13px] text-[var(--n-500)]">Thursday, April 10</p>
          </div>

          <div className="flex flex-col items-end gap-1">
            <button
              onClick={() => navigate('/settings')}
              className="w-10 h-10 rounded-full bg-[var(--brand-light)] flex items-center justify-center"
            >
              <span className="text-sm font-semibold text-[var(--brand)]">S</span>
            </button>
            <div className="flex items-center gap-1 px-2 py-0.5 bg-[var(--success-light)] rounded-full">
              <span className="text-[9px] font-medium text-[var(--success)]">● synced</span>
            </div>
          </div>
        </div>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => navigate('/intention')}
          className="w-full bg-white rounded-[14px] border border-[var(--n-200)] p-4 mb-4 text-left"
        >
          <p className="text-[10px] text-[var(--n-500)] mb-1">today's intention</p>
          <div className="flex items-center justify-between">
            <p className="text-[17px] font-semibold text-[var(--n-900)]">
              {currentIntention ? `feel ${currentIntention.toLowerCase()}` : 'set intention'}
            </p>
            <div className="w-7 h-7 rounded-full bg-[var(--brand-extra-light)] flex items-center justify-center">
              <span className="text-sm text-[var(--brand)]">◎</span>
            </div>
          </div>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-4 mb-4"
        >
          <div className="flex-1 bg-white rounded-xl border border-[var(--n-200)] p-3">
            <p className="text-[10px] text-[var(--n-500)] mb-1">streak</p>
            <p className="text-xl font-bold text-[var(--n-900)]">{streak} days</p>
            <p className="text-[9px] text-[var(--n-400)]">personal best 18</p>
          </div>

          <div className="flex-1 bg-white rounded-xl border border-[var(--n-200)] p-3">
            <p className="text-[10px] text-[var(--n-500)] mb-1">today</p>
            <p className="text-xl font-bold text-[var(--n-900)]">{todayCheckIns.length} checks</p>
            <p className="text-[9px] text-[var(--n-400)]">goal: 5</p>
          </div>
        </motion.div>

        {lastCheckIn ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-[14px] border border-[var(--n-200)] p-4 mb-4"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-[var(--n-500)]">last check-in</p>
              <p className="text-[10px] text-[var(--n-400)]">
                {lastCheckIn.time.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <p className="text-[22px] font-bold text-[var(--n-900)] mb-2 capitalize">
              {lastCheckIn.mood}
            </p>
            <div className="flex items-center gap-2">
              <div
                className="w-1 h-5 rounded-full"
                style={{ backgroundColor: getMoodColor(lastCheckIn.mood) }}
              />
              {lastCheckIn.tags.map((tag) => (
                <div
                  key={tag}
                  className="px-2 py-0.5 bg-[var(--success-light)] rounded-full text-[10px] font-medium text-[var(--success)]"
                >
                  {tag}
                </div>
              ))}
            </div>
          </motion.div>
        ) : null}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[var(--brand-extra-light)] rounded-xl border border-[var(--brand-light)] p-4 flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-md bg-[var(--brand-light)] flex items-center justify-center">
            <Music className="w-4 h-4 text-[var(--brand)]" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-[var(--brand-dark)]">flow state</p>
            <p className="text-[10px] text-[var(--n-500)]">curated for focused intent</p>
          </div>
          <span className="text-[11px] font-medium text-[var(--brand)]">open →</span>
        </motion.div>
      </div>

      <button
        onClick={() => setShowCheckIn(true)}
        className="fixed bottom-6 left-6 right-6 max-w-[390px] mx-auto h-[52px] bg-[var(--brand)] text-white text-base font-semibold rounded-[14px]"
      >
        check in now
      </button>

      {showCheckIn && (
        <div
          onClick={() => setShowCheckIn(false)}
          className="fixed inset-0 bg-black/45 z-50"
        >
          <div onClick={(e) => e.stopPropagation()}>
            {/* CheckIn modal would go here - navigating instead for now */}
            {navigate('/checkin')}
          </div>
        </div>
      )}
    </PhoneFrame>
  );
}
