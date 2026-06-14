'use client';

import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';

export function useWindowSizeCustom() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    function updateSize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

interface ConfettiOverlayProps {
  show: boolean;
  onComplete?: () => void;
}

export function ConfettiOverlay({ show, onComplete }: ConfettiOverlayProps) {
  const { width, height } = useWindowSizeCustom();

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      <Confetti
        width={width}
        height={height}
        recycle={false}
        numberOfPieces={500}
        gravity={0.2}
        onConfettiComplete={onComplete}
      />
    </div>
  );
}
