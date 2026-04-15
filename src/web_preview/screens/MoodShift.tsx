import { useNavigate } from 'react-router';
import { PhoneFrame } from '../components/PhoneFrame';
import { StatusBar } from '../components/StatusBar';
import { Music, Activity } from 'lucide-react';
import { motion } from 'motion/react';

export function MoodShift() {
  const navigate = useNavigate();

  return (
    <PhoneFrame>
      <StatusBar />

      <div className="px-6 pt-20">
        <button onClick={() => navigate('/home')} className="text-[13px] text-[var(--n-500)] mb-8">
          ← back
        </button>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <div className="w-20 h-20 rounded-full bg-[var(--danger-light)] flex items-center justify-center">
            <span className="text-3xl">😔</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-[22px] font-bold text-[var(--n-900)] mb-2">want to shift this?</h1>
          <p className="text-[13px] text-[var(--n-500)]">
            you logged{' '}
            <span className="px-2 py-0.5 bg-[var(--danger-light)] rounded text-[var(--danger)]">
              low
            </span>{' '}
            at 2:00 PM
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <button className="w-full bg-white rounded-[14px] border border-[var(--n-200)] p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[var(--brand-extra-light)] flex items-center justify-center">
              <Music className="w-5 h-5 text-[var(--brand)]" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-[var(--n-900)]">mood lift playlist</p>
              <p className="text-[11px] text-[var(--n-500)]">opens Spotify or YouTube Music</p>
            </div>
            <span className="text-base text-[var(--n-400)]">→</span>
          </button>

          <button
            onClick={() => navigate('/breathe')}
            className="w-full bg-white rounded-[14px] border border-[var(--n-200)] p-4 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-lg bg-[var(--info-light)] flex items-center justify-center">
              <Activity className="w-5 h-5 text-[var(--info)]" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-[var(--n-900)]">2-min breathing</p>
              <p className="text-[11px] text-[var(--n-500)]">4-7-8 guide, always offline</p>
            </div>
            <span className="text-base text-[var(--n-400)]">→</span>
          </button>
        </motion.div>

        <button
          onClick={() => navigate('/home')}
          className="w-full text-[13px] text-[var(--n-400)] py-4 mt-6"
        >
          maybe later
        </button>
      </div>
    </PhoneFrame>
  );
}
