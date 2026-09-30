import { type FC } from 'react';

interface LoadingScreenProps {
  isLoading: boolean;
}

export const LoadingScreen: FC<LoadingScreenProps> = ({ isLoading }) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-700 select-none ${isLoading
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
        }`}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Futuristic Glowing Pulse Indicator */}
        <div className="relative flex items-center justify-center w-16 h-16">
          <div className="absolute inset-0 rounded-full border border-white/20 animate-ping opacity-75" />
          <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-white animate-spin" />
          {/* <div className="w-3 h-3 rounded-full bg-white shadow-[0_0_12px_#fff]" /> */}
        </div>

        {/* Loading Text & Branding */}
        <div className="flex flex-col items-center gap-2 text-center">
          <span
            className="text-[18px] sm:text-[22px] tracking-widest text-white font-medium uppercase"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Tracker
          </span>
          <span className="text-xs sm:text-sm text-white/50 tracking-[0.25em] uppercase animate-pulse">
            Loading visual model...
          </span>
        </div>
      </div>
    </div>
  );
};
