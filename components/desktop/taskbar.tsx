'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TaskbarProps {
  openWindows: string[];
  onStartClick: () => void;
  startMenuOpen: boolean;
}

export function Taskbar({ openWindows, onStartClick, startMenuOpen }: TaskbarProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 bg-[#c0c0c0] win95-shadow flex items-center justify-between px-2 z-50">
      <div className="flex items-center h-full gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStartClick();
          }}
          className={`h-8 px-4 ${
            startMenuOpen ? 'win95-inset' : 'win95-shadow'
          } hover:win95-inset active:win95-inset flex items-center gap-2`}
        >
          <span className="text-base font-bold">Start</span>
        </button>
        <div className="h-full border-l-2 border-gray-600 mx-1" />
        {openWindows.map((window) => (
          <button
            key={window}
            className="h-8 px-4 win95-shadow hover:win95-inset active:win95-inset text-base"
          >
            {window}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 win95-inset h-8 px-4">
        <Clock className="w-5 h-5" />
        <span className="text-base">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}