
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface UseTestTimerProps {
  duration: number; // in minutes
  onTimeUp: () => void;
}

export const useTestTimer = ({ duration, onTimeUp }: UseTestTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState(duration * 60); // in seconds
  const [timerRunning, setTimerRunning] = useState(true);
  const [isTimeWarning, setIsTimeWarning] = useState(false);

  useEffect(() => {
    if (!timerRunning) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        // Set warning state when 5 minutes or less remain
        if (prev <= 300 && !isTimeWarning) {
          setIsTimeWarning(true);
          toast.warning("5 minutes remaining!");
        }
        
        // When 1 minute remains, show another warning
        if (prev === 60) {
          toast.warning("1 minute remaining!");
        }
        
        if (prev <= 1) {
          clearInterval(timer);
          setTimerRunning(false);
          onTimeUp();
          toast.error("Time's up! Your test has been submitted.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timerRunning, isTimeWarning, onTimeUp]);

  const stopTimer = () => {
    setTimerRunning(false);
  };

  return {
    timeRemaining,
    isTimeWarning,
    timerRunning,
    stopTimer
  };
};
