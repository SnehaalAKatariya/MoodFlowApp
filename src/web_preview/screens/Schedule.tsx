import { useState } from 'react';
import { useNavigate } from 'react-router';
import { PhoneFrame } from '../components/PhoneFrame';
import { StatusBar } from '../components/StatusBar';
import { useMoodFlow } from '../context/MoodFlowContext';
import { motion } from 'motion/react';

export function Schedule() {
  const navigate = useNavigate();
  const { updateSettings } = useMoodFlow();
  const [selectedInterval, setSelectedInterval] = useState('2h');

  const handleContinue = () => {
    updateSettings({ interval: `every ${selectedInterval}` });
    navigate('/anchors');
  };

  return (
    <PhoneFrame>
      <StatusBar />

      <div className="px-6 pt-20">
        <div className="flex items-center gap-2 mb-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-[var(--n-900)]' : 'bg-[var(--n-300)]'}`}
            />
          ))}
          <span className="text-[10px] text-[var(--n-400)] ml-2">Step 1 of 3</span>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-[22px] font-bold text-[var(--n-900)] mb-2">
            when do you wake up?
          </h1>
          <p className="text-[13px] text-[var(--n-500)] mb-6">
            we'll only nudge you during your day
          </p>

          <div className="bg-white rounded-xl border border-[var(--n-200)] p-4 mb-6">
            <div className="mb-3">
              <p className="text-[11px] text-[var(--n-500)] mb-1">wake time</p>
              <p className="text-[17px] font-semibold text-[var(--n-900)]">7:00 AM</p>
            </div>
            <div className="h-[0.5px] bg-[var(--n-200)] my-3" />
            <div>
              <p className="text-[11px] text-[var(--n-500)] mb-1">sleep time</p>
              <p className="text-[17px] font-semibold text-[var(--n-900)]">11:00 PM</p>
            </div>
          </div>

          <p className="text-[13px] font-semibold text-[var(--n-800)] mb-3">check-in every</p>

          <div className="flex gap-2 mb-6">
            {['1h', '2h', '3h', 'custom'].map((interval) => (
              <button
                key={interval}
                onClick={() => setSelectedInterval(interval)}
                className={`flex-1 h-10 rounded-lg border transition-colors ${
                  selectedInterval === interval
                    ? 'bg-[var(--brand-extra-light)] border-[var(--brand)] text-[var(--brand)] font-semibold'
                    : 'bg-white border-[var(--n-200)] text-[var(--n-700)]'
                }`}
              >
                <span className="text-[13px]">{interval}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <button
          onClick={handleContinue}
          className="fixed bottom-6 left-6 right-6 h-[52px] bg-[var(--brand)] text-white text-base font-semibold rounded-[14px]"
        >
          continue
        </button>
      </div>
    </PhoneFrame>
  );
}
