import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { GoogleEvent } from '@/constants/GoogleEvent';

export function useNextClassTimer(nextevent: GoogleEvent | null) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!nextevent) {
      setTimeLeft(0);
      setProgress(0);
      return;
    }

    const updateTimer = () => {
      const now = dayjs();
      let nextClassTime;

      if (nextevent?.start?.dateTime) {
        nextClassTime = dayjs(nextevent.start.dateTime);
      } else if (nextevent.start?.date) {
        nextClassTime = dayjs(nextevent.start.date).startOf('day');
      } else {
        setTimeLeft(0);
        setProgress(0);
        return;
      }

      const remainingSeconds = nextClassTime.diff(now, 'second');
      setTimeLeft(remainingSeconds > 0 ? remainingSeconds : 0);

      const totalSeconds = nextClassTime.diff(now.startOf('day'), 'second');
      setProgress(
        totalSeconds > 0
          ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100
          : 0
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);

    return () => clearInterval(interval);
  }, [nextevent]);

  return { timeLeft, progress };
}
