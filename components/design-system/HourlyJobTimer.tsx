// components/design-system/components/HourlyJobTimer.tsx
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export interface HourlyJobTimerProps {
  startCallback?: () => void;
  stopCallback?: () => void;
  timeLimit?: number;
}

export function HourlyJobTimer({ startCallback, stopCallback, timeLimit = 60 }: HourlyJobTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(timeLimit);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [minutes, setMinutes] = useState<number>(Math.floor(timeLimit));
  const [seconds, setSeconds] = useState<number>(0);

  useEffect(() => {
    let interval: number | undefined;
    
    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          setMinutes(Math.floor(newTime / 60));
          setSeconds(newTime % 60);
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      stopCallback?.();
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, timeLeft, stopCallback]);

  const handleToggle = () => {
    if (!isRunning) {
      startCallback?.();
    }
    setIsRunning(prev => !prev);
  };

  return (
    <div className="inline-flex items-center gap-2 text-sm text-warm-gray bg-warm-beige px-3 py-1 rounded-full border border-warm-border">
      <span className={`font-medium ${timeLeft <= 60 ? 'text-warm-red' : 'text-warm-green'}`}>
        {minutes}:{seconds.toString().padStart(2, '0')}
      </span>
      <Button size="sm" onClick={handleToggle}>
        {isRunning ? 'Pause' : 'Start'}
      </Button>
    </div>
  );
}