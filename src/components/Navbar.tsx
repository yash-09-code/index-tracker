import { type FC } from 'react';

export const Navbar: FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-10 w-full px-5 sm:px-8 py-4 sm:py-5 flex justify-between items-center select-none">
      {/* Logo (left) */}
      <a
        href="#"
        className="flex items-center gap-3 text-white transition-opacity hover:opacity-80"
      >
        <span
          className="text-[21px] sm:text-[26px] tracking-tight font-medium"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Tracker
        </span>
      </a>
    </nav>
  );
};
