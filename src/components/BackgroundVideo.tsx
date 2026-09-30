import { useEffect, useRef, type FC } from 'react';

const SENSITIVITY = 0.8;
const VIDEO_SRC =
  'https://github.com/yash-09-code/index-traker/raw/refs/heads/main/face1.mp4';

interface BackgroundVideoProps {
  onLoaded?: () => void;
}

export const BackgroundVideo: FC<BackgroundVideoProps> = ({ onLoaded }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const prevXRef = useRef<number | null>(null);
  const targetTimeRef = useRef<number>(0);
  const isSeekingRef = useRef<boolean>(false);
  const hasTriggeredLoadRef = useRef<boolean>(false);

  const handleVideoReady = () => {
    if (!hasTriggeredLoadRef.current) {
      hasTriggeredLoadRef.current = true;
      if (onLoaded) {
        onLoaded();
      }
    }
  };

  useEffect(() => {
    // Fallback: If video takes longer than 4s due to network, reveal the page anyway
    const fallbackTimer = setTimeout(() => {
      handleVideoReady();
    }, 4000);

    const handleMouseMove = (e: MouseEvent) => {
      const video = videoRef.current;
      if (!video || !video.duration || Number.isNaN(video.duration)) {
        prevXRef.current = e.clientX;
        return;
      }

      if (prevXRef.current !== null) {
        const delta = e.clientX - prevXRef.current;
        const timeOffset =
          (delta / window.innerWidth) * SENSITIVITY * video.duration;
        const newTarget = Math.max(
          0,
          Math.min(video.duration, targetTimeRef.current + timeOffset)
        );
        targetTimeRef.current = newTarget;

        if (!isSeekingRef.current) {
          isSeekingRef.current = true;
          video.currentTime = newTarget;
        }
      }
      prevXRef.current = e.clientX;
    };

    // Touch support for mobile scrubbing
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const clientX = e.touches[0].clientX;
      const video = videoRef.current;
      if (!video || !video.duration || Number.isNaN(video.duration)) {
        prevXRef.current = clientX;
        return;
      }

      if (prevXRef.current !== null) {
        const delta = clientX - prevXRef.current;
        const timeOffset =
          (delta / window.innerWidth) * SENSITIVITY * video.duration;
        const newTarget = Math.max(
          0,
          Math.min(video.duration, targetTimeRef.current + timeOffset)
        );
        targetTimeRef.current = newTarget;

        if (!isSeekingRef.current) {
          isSeekingRef.current = true;
          video.currentTime = newTarget;
        }
      }
      prevXRef.current = clientX;
    };

    const handleTouchEnd = () => {
      prevXRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      clearTimeout(fallbackTimer);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onLoaded]);

  const handleSeeked = () => {
    const video = videoRef.current;
    if (!video || !video.duration) {
      isSeekingRef.current = false;
      return;
    }

    if (Math.abs(video.currentTime - targetTimeRef.current) > 0.005) {
      video.currentTime = targetTimeRef.current;
    } else {
      isSeekingRef.current = false;
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      targetTimeRef.current = videoRef.current.currentTime || 0;
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
      }}
    />
  );
};
