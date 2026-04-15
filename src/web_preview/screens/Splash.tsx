import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { PhoneFrame } from '../components/PhoneFrame';
import { motion } from 'motion/react';

export function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/welcome');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <PhoneFrame>
      <div className="flex flex-col items-center justify-center h-full">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--brand-light)] border border-[var(--brand)] mb-4"
        >
          <span className="text-base font-bold text-[var(--brand)]">M</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-2xl font-bold text-[var(--n-900)] mb-2"
        >
          MoodFlow
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="text-[13px] text-[var(--n-500)]"
        >
          how are you, really?
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="mt-12"
        >
          <div className="w-[120px] h-[3px] bg-[var(--n-200)] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '45%' }}
              transition={{ delay: 0.8, duration: 1 }}
              className="h-full bg-[var(--brand)] rounded-full"
            />
          </div>
          <p className="text-[11px] text-[var(--n-400)] mt-3 text-center">
            setting up your space…
          </p>
        </motion.div>
      </div>
    </PhoneFrame>
  );
}
