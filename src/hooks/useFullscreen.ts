import { useEffect, useState } from 'react';

export function useFullscreen(targetRef: React.RefObject<HTMLElement>) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = async () => {
    try {
      const el = targetRef.current || document.documentElement;
      const isFs = !!(document.fullscreenElement || (document as any).webkitFullscreenElement);
      if (!isFs) {
        const req = (el as any).requestFullscreen || (el as any).webkitRequestFullscreen || (el as any).mozRequestFullScreen || (el as any).msRequestFullscreen;
        if (req) await req.call(el);
      } else {
        const exit = (document as any).exitFullscreen || (document as any).webkitExitFullscreen || (document as any).mozCancelFullScreen || (document as any).msExitFullscreen;
        if (exit) await exit.call(document);
      }
      // state will be synced by the 'fullscreenchange' listener
    } catch {}
  };

  useEffect(() => {
    const onFullChange = () => {
      const isFs = !!(document.fullscreenElement || (document as any).webkitFullscreenElement);
      setIsFullscreen(isFs);
    };
    document.addEventListener('fullscreenchange', onFullChange);
    document.addEventListener('webkitfullscreenchange', onFullChange as any);
    return () => {
      document.removeEventListener('fullscreenchange', onFullChange);
      document.removeEventListener('webkitfullscreenchange', onFullChange as any);
    };
  }, []);

  return { isFullscreen, toggleFullscreen } as const;
}

