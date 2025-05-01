
import React from 'react';
import { Clock } from 'lucide-react';

interface TestTimerProps {
  timeRemaining: number;
  isTimeWarning: boolean;
}

const TestTimer: React.FC<TestTimerProps> = ({ timeRemaining, isTimeWarning }) => {
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hours > 0 ? `${hours}:` : '',
      `${minutes.toString().padStart(2, '0')}:`,
      secs.toString().padStart(2, '0')
    ].join('');
  };

  return (
    <div className="flex items-center space-x-2">
      <Clock className={`h-4 w-4 ${isTimeWarning ? 'text-red-500' : 'text-muted-foreground'}`} />
      <span className={`font-mono ${isTimeWarning ? 'text-red-600 animate-pulse' : ''}`}>
        {formatTime(timeRemaining)}
      </span>
    </div>
  );
};

export default TestTimer;
