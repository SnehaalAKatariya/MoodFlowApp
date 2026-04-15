import { useNavigate } from 'react-router';
import { PhoneFrame } from '../components/PhoneFrame';
import { StatusBar } from '../components/StatusBar';
import { motion } from 'motion/react';

const barData = [38, 28, 70, 52, 100, 35, 58];
const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function Recap() {
  const navigate = useNavigate();

  return (
    <PhoneFrame>
      <StatusBar />

      <div className="px-6 pt-20 pb-24">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate('/home')} className="text-[13px] text-[var(--n-500)]">
            week of Apr 7
          </button>
          <button className="px-3 py-1.5 bg-[var(--brand-extra-light)] rounded-lg text-[11px] font-semibold text-[var(--brand)]">
            share ↑
          </button>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-[28px] font-bold text-[var(--n-900)] mb-2">your week</h1>
          <p className="text-xs text-[var(--n-500)] mb-6">7 check-ins · 5-day streak</p>

          <div className="bg-white rounded-[14px] border border-[var(--n-200)] p-4 mb-4">
            <p className="text-[10px] text-[var(--n-500)] mb-4">mood curve</p>
            <div className="flex items-end justify-between gap-2 h-[65px]">
              {barData.map((value, i) => {
                const height = Math.round(value * 0.65);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${height}px` }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className="w-full rounded-t"
                      style={{
                        backgroundColor: i === 4 ? 'var(--brand)' : 'var(--brand-light)',
                      }}
                    />
                    <p className="text-[9px] text-[var(--n-400)] mt-1">{days[i]}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-4 mb-4">
            <div className="flex-1 bg-white rounded-xl border border-[var(--n-200)] p-3">
              <p className="text-[10px] text-[var(--n-500)] mb-1">peak day</p>
              <p className="text-[17px] font-semibold text-[var(--n-900)]">Friday</p>
            </div>

            <div className="flex-1 bg-white rounded-xl border border-[var(--n-200)] p-3">
              <p className="text-[10px] text-[var(--n-500)] mb-1">top tag</p>
              <p className="text-[17px] font-semibold text-[var(--n-900)] mb-1">Work</p>
              <div className="px-2 py-0.5 bg-[var(--success-light)] rounded-full text-[9px] font-medium text-[var(--success)] inline-block">
                work
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[var(--n-200)] p-3 mb-4 flex items-center justify-between">
            <p className="text-xs text-[var(--n-500)]">average mood</p>
            <div className="flex items-center gap-2">
              <div className="w-[3px] h-5 bg-[var(--n-200)] rounded-full" />
              <p className="text-sm font-semibold text-[var(--n-900)]">Good</p>
            </div>
          </div>

          <div className="bg-[var(--n-100)] rounded-xl p-3">
            <p className="text-[11px] text-[var(--n-600)]">
              your best day was Friday with 3 check-ins
            </p>
          </div>
        </motion.div>

        <button className="fixed bottom-6 left-6 right-6 max-w-[390px] mx-auto h-[52px] bg-[var(--brand)] text-white text-base font-semibold rounded-[14px]">
          share this week
        </button>
      </div>
    </PhoneFrame>
  );
}
