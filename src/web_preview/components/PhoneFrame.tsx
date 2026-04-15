import { ReactNode } from 'react';

interface PhoneFrameProps {
  children: ReactNode;
  className?: string;
}

export function PhoneFrame({ children, className = '' }: PhoneFrameProps) {
  return (
    <div className={`relative w-full max-w-[390px] h-[844px] mx-auto bg-[var(--background)] overflow-hidden ${className}`}>
      {children}
    </div>
  );
}
