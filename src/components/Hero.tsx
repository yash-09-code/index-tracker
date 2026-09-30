import { useState, useEffect, type FC } from 'react';
import { useTypewriter } from '../hooks/useTypewriter';

const TYPEWRITER_TEXT =
  'Discover Your Body in Every Point and Line.';

const EXPLORE_URL = 'https://yash-09-code.github.io/tracker';

interface HeroProps {
  isReady?: boolean;
}

export const Hero: FC<HeroProps> = ({ isReady = true }) => {
  const { displayed, done } = useTypewriter(TYPEWRITER_TEXT, {
    speed: 38,
    startDelay: isReady ? 600 : 999999,
  });

  const [buttonsVisible, setButtonsVisible] = useState(false);

  useEffect(() => {
    if (!isReady) return;
    const timer = setTimeout(() => {
      setButtonsVisible(true);
    }, 400);
    return () => clearTimeout(timer);
  }, [isReady]);

  return (
    <section className="relative z-[1] w-full h-screen flex flex-col justify-end pb-12 md:justify-center md:pb-0 px-5 sm:px-8 md:px-10 overflow-hidden select-none">
      <div className="max-w-xl relative z-10">
        {/* 1. Blurred intro label */}
        <div
          className="pointer-events-none select-none mb-5 sm:mb-6 font-normal text-white"
          style={{
            fontSize: 'clamp(18px, 4vw, 26px)',
            lineHeight: 1.3,
            filter: 'blur(3px)',
          }}
        >
          Hey there, I'm Yash,
          <br />
          Your Body. Your Landmarks. Your Vision.
        </div>

        {/* 2. Typewriter text */}
        <p
          className="text-white mb-5 sm:mb-6 font-normal"
          style={{
            fontSize: 'clamp(18px, 4vw, 26px)',
            lineHeight: 1.35,
            minHeight: '54px',
          }}
        >
          {displayed}
          {!done && (
            <span
              className="inline-block w-[2px] h-[1.1em] bg-white align-middle ml-[2px] animate-blink"
              aria-hidden="true"
            />
          )}
        </p>

        {/* 3. Action pill button */}
        <div
          className="flex flex-wrap gap-y-1 transition-all duration-400 ease-out"
          style={{
            opacity: buttonsVisible ? 1 : 0,
            transform: buttonsVisible ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
          }}
        >
          <a
            href={EXPLORE_URL}
            target="_self"
            className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-6 sm:px-7 py-[0.35em] mx-[0.2em] mb-[0.4em] whitespace-nowrap cursor-pointer hover:bg-black hover:text-white transition-colors duration-200 active:scale-95 no-underline font-medium"
          >
            Explore now
          </a>
        </div>
      </div>
    </section>
  );
};