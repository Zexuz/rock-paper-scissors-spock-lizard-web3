import {useEffect, useState} from "react";

interface CountdownProps {
  timeLeft: number
}

export function Countdown({timeLeft}: CountdownProps) {
  const [countdown, setCountdown] = useState(timeLeft);

  useEffect(() => {
    setCountdown(timeLeft);
    const interval = setInterval(() => setCountdown(prevCountdown => Math.max(prevCountdown - 1, 0)), 1000);
    return () => clearInterval(interval);

  }, [timeLeft]);

  const minutes = Math.floor((countdown % 3600) / 60);
  const seconds = Math.floor((countdown % 3600) % 60);

  const secondsString = seconds < 10 ? `0${seconds}` : seconds;
  const minutesString = minutes < 10 ? `0${minutes}` : minutes;

  return (
    <div className="text-lg text-gray-600">
      <p>Time remaining: {minutesString}m {secondsString}s</p>
    </div>
  );
}
