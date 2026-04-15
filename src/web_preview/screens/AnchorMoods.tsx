import { useState } from 'react';
import { useNavigate } from 'react-router';
import { PhoneFrame } from '../components/PhoneFrame';
import { StatusBar } from '../components/StatusBar';
import { useMoodFlow } from '../context/MoodFlowContext';
import { motion } from 'motion/react';

const moods = [
  'Happy',
  'Calm',
  'Energised',
  'Focused',
  'Resilient',
  'Rested',
  'Content',
  'Motivated',
];

export function AnchorMoods() {
  const navigate = useNavigate();
  const { updateSettings } = useMoodFlow();
  const [selected, setSelected] = useState<string[]>(['Happy', 'Calm', 'Focused']);

  const toggleMood = (mood: string) => {
    if (selected.includes(mood)) {
      setSelected(selected.filter((m) => m !== mood));
    } else if (selected.length < 3) {
      setSelected([...selected, mood]);
    }
  };

  const handleContinue = () => {
    updateSettings({ anchorMoods: selected });
    navigate('/permission');
  };

  return (
    <PhoneFrame>
      <StatusBar />

      <div className="px-6 pt-20">
        <div className="flex items-center gap-2 mb-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-[var(--n-900)]' : 'bg-[var(--n-300)]'}`}
            />
          ))}
          <span className="text-[10px] text-[var(--n-400)] ml-2">Step 2 of 3</span>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-[22px] font-bold text-[var(--n-900)] mb-1">
            which moods matter most?
          </h1>
          <p className="text-[13px] text-[var(--n-500)] mb-6">pick exactly 3</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {moods.map((mood) => {
              const isSelected = selected.includes(mood);
              return (
                <button
                  key={mood}
                  onClick={() => toggleMood(mood)}
                  className={`h-[68px] rounded-xl border transition-colors ${
                    isSelected
                      ? 'bg-[var(--brand-extra-light)] border-[var(--brand)] border-[1.5px]'
                      : 'bg-white border-[var(--n-200)]'
                  }`}
                >
                  <div className="flex items-center px-3">
                    <div
                      className={`w-[14px] h-[14px] rounded-full border flex items-center justify-center ${
                        isSelected
                          ? 'bg-[var(--brand)] border-[var(--brand)]'
                          : 'bg-white border-[var(--n-300)] border-[1.5px]'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span
                      className={`ml-3 text-[13px] ${
                        isSelected
                          ? 'font-semibold text-[var(--brand)]'
                          : 'font-normal text-[var(--n-800)]'
                      }`}
                    >
                      {mood}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <p className="text-xs font-medium text-[var(--brand)] text-center mb-8">
            {selected.length} of 3 selected
          </p>
        </motion.div>

        <button
          onClick={handleContinue}
          disabled={selected.length !== 3}
          className="fixed bottom-6 left-6 right-6 h-[52px] bg-[var(--brand)] text-white text-base font-semibold rounded-[14px] disabled:opacity-50"
        >
          continue
        </button>
      </div>
    </PhoneFrame>
  );
}
