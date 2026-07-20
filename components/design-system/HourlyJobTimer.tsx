// components/design-system/components/HourlyJobTimer.tsx
import { useState, useEffect } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';

export function HourlyJobTimer({ startCallback, stopCallback, timeLimit = 60 }: any) {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isRunning, setIsRunning] = useState(false);
  const [minutes, setMinutes] = useState(timeLimit);
  const [seconds, setSeconds] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [warnings, setWarnings] = useState<number[]>([]);

  useEffect(() => {
    let interval: number | null = null;
    
    if (isRunning && timeLimit > 0) {
      interval = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 0) {
            clearInterval(interval!);
            setCompleted(true);
            setWarnings(prevPos => [...prevWarnings, prevPos]);
            if (completed) {
              setIsRunning(false);
              stopCallback?.();
            }
            return 0;
          }
          const minutes = Math.floor(prev / 60);
          const seconds = prev % 60;
          setMinutes(m);
          setSeconds(s);
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLimit, stoppedCallback]);

  useEffect(() => {
    if (timeLeft <= 60) {
      setWarnings(prev => [...prev, 60]);
    }
  }, [timeLeft]);

  const renderTime = () => {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (completed) return <div className="text-warm-red font-medium break-normal">Applied</div>;

  const colors = isRunning ? 
    timeLeft <= 60 ? 'text-warm-red' : 
    timeLeft <= 180 ? 'text-warm-red' : 
    'text-warm-green' :
    'text-warm-muted';

  return (
    <div className="flex items-center gap-2 text-sm text-warm-gray bg-warm-beige px-3 py-1 rounded-full border border-warm-border dark:border-warm-border">
      <span className={colors} font-medium>{renderTime()}</span>
      {!isRunning && <Button size="sm" onClick={() => setIsRunning(true)}>{'Start'}</Button>}
      {isRunning && <Button size="sm" onClick={() => setIsRunning(false)}>{'Pause'}</Button>}
    </div>
  );
}