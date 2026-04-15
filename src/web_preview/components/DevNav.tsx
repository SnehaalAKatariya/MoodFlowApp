import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';

const screens = [
  { path: '/', label: 'S01 Splash' },
  { path: '/welcome', label: 'S02 Welcome' },
  { path: '/schedule', label: 'S03 Schedule' },
  { path: '/anchors', label: 'S04 Anchors' },
  { path: '/permission', label: 'S05 Permission' },
  { path: '/home', label: 'S06 Home' },
  { path: '/checkin', label: 'S07 Check-In' },
  { path: '/intention', label: 'S08 Intention' },
  { path: '/mood-shift', label: 'S09 Mood Shift' },
  { path: '/breathe', label: 'S10 Breathe' },
  { path: '/recap', label: 'S11 Recap' },
  { path: '/settings', label: 'S12 Settings' },
];

export function DevNav() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (process.env.NODE_ENV === 'production') return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-[100] w-10 h-10 bg-black/80 text-white rounded-full flex items-center justify-center hover:bg-black/90 transition-colors"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div className="fixed top-16 right-4 z-[100] w-48 bg-white rounded-xl shadow-2xl border border-[var(--n-200)] overflow-hidden">
          <div className="p-2 bg-[var(--n-100)] border-b border-[var(--n-200)]">
            <p className="text-xs font-semibold text-[var(--n-900)]">Screen Navigator</p>
          </div>
          <div className="max-h-[500px] overflow-y-auto">
            {screens.map(({ path, label }) => (
              <button
                key={path}
                onClick={() => {
                  navigate(path);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-xs transition-colors ${
                  location.pathname === path
                    ? 'bg-[var(--brand-extra-light)] text-[var(--brand)] font-semibold'
                    : 'text-[var(--n-700)] hover:bg-[var(--n-100)]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
