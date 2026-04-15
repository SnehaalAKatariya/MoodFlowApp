import { useNavigate } from 'react-router';
import { PhoneFrame } from '../components/PhoneFrame';
import { StatusBar } from '../components/StatusBar';
import { useMoodFlow } from '../context/MoodFlowContext';
import { Bell } from 'lucide-react';
import { motion } from 'motion/react';

export function Permission() {
  const navigate = useNavigate();
  const { completeOnboarding, updateSettings } = useMoodFlow();

  const handleAllow = () => {
    updateSettings({ notificationsEnabled: true });
    completeOnboarding();
    navigate('/home');
  };

  const handleSkip = () => {
    updateSettings({ notificationsEnabled: false });
    completeOnboarding();
    navigate('/home');
  };

  return (
    <PhoneFrame>
      <StatusBar />

      <div className="px-6 pt-20 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${i === 2 ? 'bg-[var(--n-900)]' : 'bg-[var(--n-300)]'}`}
            />
          ))}
          <span className="text-[10px] text-[var(--n-400)] ml-2">Step 3 of 3</span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center -mt-20">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-20 h-20 rounded-full bg-[var(--brand-extra-light)] border border-[var(--brand-light)] flex items-center justify-center mb-6"
          >
            <Bell className="w-6 h-6 text-[var(--brand)]" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-2xl font-bold text-[var(--n-900)] text-center mb-4">
              one last thing
            </h1>

            <p className="text-[13px] text-[var(--n-500)] text-center px-6 leading-relaxed">
              MoodFlow sends quiet nudges during your day. no spam — just check-ins when you
              asked for them.
            </p>
          </motion.div>
        </div>

        <div className="mb-8">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            onClick={handleAllow}
            className="w-full h-[52px] bg-[var(--brand)] text-white text-base font-semibold rounded-[14px] mb-3"
          >
            allow notifications
          </motion.button>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={handleSkip}
            className="w-full h-12 bg-white text-[var(--n-700)] text-[15px] font-medium rounded-[14px] border border-[var(--n-300)]"
          >
            not now
          </motion.button>

          <p className="text-[11px] text-[var(--n-400)] text-center mt-4">
            you can enable this later in settings
          </p>
        </div>
      </div>
    </PhoneFrame>
  );
}
