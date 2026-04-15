import { useState } from 'react';
import { useNavigate } from 'react-router';
import { PhoneFrame } from '../components/PhoneFrame';
import { useMoodFlow, Intention } from '../context/MoodFlowContext';
import { motion } from 'motion/react';

const intentions: Array<{ label: Intention; desc: string }> = [
  { label: 'Energised', desc: 'start with momentum' },
  { label: 'Calm', desc: 'steady and present' },
  { label: 'Focused', desc: 'deep work, low noise' },
  { label: 'Happy', desc: 'light and open' },
  { label: 'Resilient', desc: 'whatever comes' },
];

export function IntentionModal() {
  const navigate = useNavigate();
  const { setIntention, currentIntention } = useMoodFlow();
  const [selected, setSelected] = useState<Intention | null>(currentIntention);

  const handleSet = () => {
    if (selected) {
      setIntention(selected);
      navigate('/home');
    }
  };

  return (
    <PhoneFrame>
      <div className="fixed inset-0 bg-black/45 flex items-end">
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full bg-white rounded-t-3xl pb-6"
        >
          <div className="flex justify-center pt-3 pb-4">
            <div className="w-16 h-1 bg-[var(--n-300)] rounded-full" />
          </div>

          <div className="px-4">
            <h2 className="text-[17px] font-semibold text-[var(--n-900)] text-center mb-1">
              set your tone for today
            </h2>
            <p className="text-xs text-[var(--n-500)] text-center mb-6">Thursday, April 10</p>

            <div className="space-y-4 mb-6">
              {intentions.map(({ label, desc }) => {
                const isSelected = selected === label;
                return (
                  <button
                    key={label}
                    onClick={() => setSelected(label)}
                    className={`w-full bg-white rounded-xl border p-4 text-left transition-all ${
                      isSelected
                        ? 'bg-[var(--brand-extra-light)] border-[var(--brand)] border-[1.5px]'
                        : 'border-[var(--n-200)]'
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-[18px] h-[18px] rounded-full border flex items-center justify-center ${
                          isSelected
                            ? 'bg-[var(--brand)] border-[var(--brand)]'
                            : 'bg-white border-[var(--n-300)] border-[1.5px]'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <div className="ml-3">
                        <p
                          className={`text-sm ${
                            isSelected
                              ? 'font-semibold text-[var(--brand)]'
                              : 'font-medium text-[var(--n-900)]'
                          }`}
                        >
                          {label}
                        </p>
                        <p className="text-[11px] text-[var(--n-500)]">{desc}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleSet}
              disabled={!selected}
              className="w-full h-[52px] bg-[var(--brand)] text-white text-base font-semibold rounded-[14px] disabled:bg-[var(--n-200)] disabled:text-[var(--n-400)]"
            >
              set intention
            </button>
          </div>
        </motion.div>
      </div>
    </PhoneFrame>
  );
}
