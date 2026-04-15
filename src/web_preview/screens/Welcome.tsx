import { useNavigate } from 'react-router';
import { PhoneFrame } from '../components/PhoneFrame';
import { motion } from 'motion/react';

export function Welcome() {
  const navigate = useNavigate();

  return (
    <PhoneFrame>
      <div className="flex flex-col h-full px-6 pt-40">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--brand-light)] border border-[var(--brand)] mx-auto mb-16"
        >
          <span className="text-base font-bold text-[var(--brand)]">M</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-[28px] font-bold text-[var(--n-900)] leading-tight">
            understand how
          </h1>
          <h1 className="text-[28px] font-bold text-[var(--n-900)] leading-tight mb-10">
            you feel, hourly
          </h1>

          <p className="text-sm text-[var(--n-500)] mb-1">
            5-second check-ins. a playlist when
          </p>
          <p className="text-sm text-[var(--n-500)] mb-1">
            you dip. a weekly picture of your
          </p>
          <p className="text-sm text-[var(--n-500)]">emotional life.</p>
        </motion.div>

        <div className="mt-auto mb-8">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            onClick={() => navigate('/schedule')}
            className="w-full h-[52px] bg-[var(--brand)] text-white text-base font-semibold rounded-[14px] mb-3"
          >
            get started
          </motion.button>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            onClick={() => navigate('/home')}
            className="w-full h-12 bg-white text-[var(--n-700)] text-[15px] font-medium rounded-[14px] border border-[var(--n-300)]"
          >
            sign in
          </motion.button>

          <p className="text-[11px] text-[var(--n-400)] text-center mt-4">
            your data stays on your device first
          </p>
        </div>
      </div>
    </PhoneFrame>
  );
}
