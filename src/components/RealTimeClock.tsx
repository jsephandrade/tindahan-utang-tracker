
import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

const RealTimeClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-orange-200 rounded-lg px-3 py-2 text-sm">
      <Clock className="h-4 w-4 text-orange-600" />
      <div className="text-center">
        <div className="font-medium text-gray-800">{formatTime(currentTime)}</div>
        <div className="text-xs text-gray-600">{formatDate(currentTime)}</div>
      </div>
    </div>
  );
};

export default RealTimeClock;
