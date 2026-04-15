import { useNavigate } from 'react-router';
import { PhoneFrame } from '../components/PhoneFrame';
import { StatusBar } from '../components/StatusBar';
import { useMoodFlow } from '../context/MoodFlowContext';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';

export function Settings() {
  const navigate = useNavigate();
  const { settings, updateSettings } = useMoodFlow();

  return (
    <PhoneFrame>
      <StatusBar />

      <div className="px-6 pt-20 pb-24">
        <button onClick={() => navigate('/home')} className="mb-6">
          <ChevronLeft className="w-5 h-5 text-[var(--n-700)]" />
        </button>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-[var(--n-900)] mb-8">settings</h1>

          <div className="mb-6">
            <p className="text-[10px] font-medium text-[var(--n-500)] mb-2 uppercase">
              notifications
            </p>
            <div className="bg-white rounded-[14px] border border-[var(--n-200)] divide-y divide-[var(--n-200)]">
              <div className="flex items-center justify-between p-4">
                <span className="text-[13px] text-[var(--n-900)]">wake time</span>
                <span className="text-xs text-[var(--n-500)]">{settings.wakeTime}</span>
              </div>
              <div className="flex items-center justify-between p-4">
                <span className="text-[13px] text-[var(--n-900)]">sleep time</span>
                <span className="text-xs text-[var(--n-500)]">{settings.sleepTime}</span>
              </div>
              <div className="flex items-center justify-between p-4">
                <span className="text-[13px] text-[var(--n-900)]">interval</span>
                <span className="text-xs text-[var(--n-500)]">{settings.interval}</span>
              </div>
              <div className="flex items-center justify-between p-4">
                <span className="text-[13px] text-[var(--n-900)]">notifications</span>
                <button
                  onClick={() =>
                    updateSettings({ notificationsEnabled: !settings.notificationsEnabled })
                  }
                  className={`w-[34px] h-5 rounded-full transition-colors relative ${
                    settings.notificationsEnabled ? 'bg-[var(--brand)]' : 'bg-[var(--n-300)]'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-[14px] h-[14px] bg-white rounded-full transition-transform ${
                      settings.notificationsEnabled ? 'translate-x-[18px]' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-[10px] font-medium text-[var(--n-500)] mb-2 uppercase">account</p>
            <div className="bg-white rounded-[14px] border border-[var(--n-200)] divide-y divide-[var(--n-200)]">
              <div className="flex items-center justify-between p-4">
                <span className="text-[13px] text-[var(--n-900)]">export my data</span>
                <span className="text-[13px] text-[var(--n-500)]">›</span>
              </div>
              <div className="flex items-center justify-between p-4">
                <span className="text-[13px] text-[var(--n-900)]">dark mode</span>
                <button
                  onClick={() => updateSettings({ darkMode: !settings.darkMode })}
                  className={`w-[34px] h-5 rounded-full transition-colors relative ${
                    settings.darkMode ? 'bg-[var(--brand)]' : 'bg-[var(--n-300)]'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-[14px] h-[14px] bg-white rounded-full transition-transform ${
                      settings.darkMode ? 'translate-x-[18px]' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-medium text-[var(--danger)] mb-2 uppercase">
              danger zone
            </p>
            <div className="bg-white rounded-[14px] border-[1.5px] border-[var(--danger-light)] divide-y divide-[var(--n-200)]">
              <div className="flex items-center justify-between p-4">
                <span className="text-[13px] font-semibold text-[var(--danger)]">
                  clear all data
                </span>
                <span className="text-[13px] text-[var(--danger)]">›</span>
              </div>
              <div className="flex items-center justify-between p-4">
                <span className="text-[13px] font-semibold text-[var(--danger)]">
                  delete account
                </span>
                <span className="text-[13px] text-[var(--danger)]">›</span>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-[var(--n-400)] text-center mt-12">v1.0.0</p>
        </motion.div>
      </div>
    </PhoneFrame>
  );
}
