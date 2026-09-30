import { useEffect, useRef, type FC } from 'react';

const SENSITIVITY = 0.6;
const VIDEO_SRC =
  'https://github.com/yash-09-code/index-traker/raw/refs/heads/main/face1.mp4';

interface BackgroundVideoProps {
  onLoaded?: () => void;
}

export const BackgroundVideo: FC<BackgroundVideoProps> = ({ onLoaded }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetTimeRef = useRef<number>(0);
  const currentTimeRef = useRef<number>(0);
  const prevXRef = useRef<number | null>(null);
  const isSeekingRef = useRef<boolean>(false);
  const hasTriggeredLoadRef = useRef<boolean>(false);
  const rafIdRef = useRef<number | null>(null);

  const handleVideoReady = () => {
    if (!hasTriggeredLoadRef.current) {
      hasTriggeredLoadRef.current = true;
      if (onLoaded) {
        onLoaded();
      }
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Smooth RequestAnimationFrame loop with LERP interpolation
    const updateFrame = () => {
      if (video && video.duration && !Number.isNaN(video.duration)) {
        const diff = targetTimeRef.current - currentTimeRef.current;
        if (Math.abs(diff) > 0.002) {
          // Smooth easing factor
          currentTimeRef.current += diff * 0.18;
          const target = Math.max(
            0,
            Math.min(video.duration, currentTimeRef.current)
          );

          if (!isSeekingRef.current && !video.seeking) {
            isSeekingRef.current = true;
            if (
              'fastSeek' in video &&
              typeof (video as unknown as { fastSeek: (t: number) => void })
                .fastSeek === 'function'
            ) {
              (
                video as unknown as { fastSeek: (t: number) => void }
              ).fastSeek(target);
            } else {
              video.currentTime = target;
            }
          }
        }
      }
      rafIdRef.current = requestAnimationFrame(updateFrame);
    };

    rafIdRef.current = requestAnimationFrame(updateFrame);

    const handleMouseMove = (e: MouseEvent) => {
      if (!video || !video.duration || Number.isNaN(video.duration)) {
        prevXRef.current = e.clientX;
        return;
      }

      if (prevXRef.current !== null) {
        const delta = e.clientX - prevXRef.current;
        const timeOffset =
          (delta / window.innerWidth) * SENSITIVITY * video.duration;
        targetTimeRef.current = Math.max(
          0,
          Math.min(video.duration, targetTimeRef.current + timeOffset)
        );
      }
      prevXRef.current = e.clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (
        e.touches.length === 0 ||
        !video ||
        !video.duration ||
        Number.isNaN(video.duration)
      )
        return;
      const clientX = e.touches[0].clientX;
      if (prevXRef.current !== null) {
        const delta = clientX - prevXRef.current;
        const timeOffset =
          (delta / window.innerWidth) * SENSITIVITY * video.duration;
        targetTimeRef.current = Math.max(
          0,
          Math.min(video.duration, targetTimeRef.current + timeOffset)
        );
      }
      prevXRef.current = clientX;
    };

    const handleTouchEnd = () => {
      prevXRef.current = null;
    };

    const handleMouseLeave = () => {
      prevXRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Fallback: If video takes longer than 3.5s due to network, reveal the page anyway
    const fallbackTimer = setTimeout(() => {
      handleVideoReady();
    }, 3500);

    return () => {
      clearTimeout(fallbackTimer);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onLoaded]);

  const handleSeeked = () => {
    isSeekingRef.current = false;
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      targetTimeRef.current = videoRef.current.currentTime || 0;
      currentTimeRef.current = targetTimeRef.current;
      handleVideoReady();
    }
  };

  return (
    <video
      ref={videoRef}
      src={VIDEO_SRC}
      muted
      playsInline
      preload="auto"
      onCanPlay={handleVideoReady}
      onLoadedData={handleVideoReady}
      onSeeked={handleSeeked}
      onLoadedMetadata={handleLoadedMetadata}
      className="fixed inset-0 z-0 w-full h-full object-cover pointer-events-none select-none"
      style={{
        objectPosition: '0% center',
        transform: 'translateZ(0)',
        willChange: 'transform',
      }}
    />
  );
};
