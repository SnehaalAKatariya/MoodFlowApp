import { useState } from 'react';
import { useNavigate } from 'react-router';
import { PhoneFrame } from '../components/PhoneFrame';
import { useMoodFlow, Mood, Tag } from '../context/MoodFlowContext';
import { motion } from 'motion/react';

const moodData: Array<{ label: Mood; bg: string; fg: string }> = [
  { label: 'rough', bg: 'var(--mood-rough-light)', fg: 'var(--mood-rough)' },
  { label: 'low', bg: 'var(--danger-light)', fg: 'var(--danger)' },
  { label: 'okay', bg: 'var(--warning-light)', fg: 'var(--warning)' },
  { label: 'good', bg: 'var(--success-light)', fg: 'var(--success)' },
  { label: 'great', bg: 'var(--success-light)', fg: 'var(--mood-great)' },
];

const tags: Tag[] = ['work', 'sleep', 'food', 'social', 'exercise'];

export function CheckIn() {
  const navigate = useNavigate();
  const { addCheckIn } = useMoodFlow();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const toggleTag = (tag: Tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = () => {
    if (selectedMood) {
      addCheckIn(selectedMood, selectedTags);
      if (selectedMood === 'low' || selectedMood === 'rough') {
        navigate('/mood-shift');
      } else {
        navigate('/home');
      }
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
              how are you feeling?
            </h2>
            <p className="text-xs text-[var(--n-500)] text-center mb-6">
              {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} ·
              Thursday
            </p>

            <div className="flex gap-2 mb-6">
              {moodData.map(({ label, bg, fg }) => {
                const isSelected = selectedMood === label;
                return (
                  <button
                    key={label}
                    onClick={() => setSelectedMood(label)}
                    className="flex-1 h-[72px] rounded-xl transition-all"
                    style={{
                      backgroundColor: isSelected ? 'var(--brand-extra-light)' : bg,
                      border: `${isSelected ? '2px' : '1px'} solid ${isSelected ? 'var(--brand)' : bg}`,
                    }}
                  >
                    <div className="flex flex-col items-center justify-center h-full">
                      <div
                        className="w-6 h-6 rounded-full mb-2 flex items-center justify-center"
                        style={{ backgroundColor: isSelected ? 'var(--brand-light)' : bg }}
                      >
                        <span className="text-xs" style={{ color: isSelected ? 'var(--brand)' : fg }}>
                          ●
                        </span>
                      </div>
                      <span
                        className={`text-[9px] ${isSelected ? 'font-semibold' : 'font-normal'}`}
                        style={{ color: isSelected ? 'var(--brand)' : 'var(--n-600)' }}
                      >
                        {label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mb-6">
              <p className="text-[11px] text-[var(--n-500)] mb-2">
                tag it <span className="text-[var(--n-400)]">(optional)</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-[14px] text-[10px] transition-colors ${
                        isSelected
                          ? 'bg-[var(--brand-extra-light)] border-[1.5px] border-[var(--brand)] text-[var(--brand)] font-semibold'
                          : 'bg-[var(--n-100)] text-[var(--n-600)]'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={!selectedMood}
              className="w-full h-[52px] bg-[var(--brand)] text-white text-base font-semibold rounded-[14px] disabled:bg-[var(--n-200)] disabled:text-[var(--n-400)] mb-3"
            >
              save
            </button>

            <button
              onClick={() => navigate('/home')}
              className="w-full text-[13px] text-[var(--n-400)] py-2"
            >
              skip
            </button>
          </div>
        </motion.div>
      </div>
    </PhoneFrame>
  );
}
