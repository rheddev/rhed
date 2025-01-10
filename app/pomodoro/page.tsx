"use client";

import React, { useEffect, useState } from "react";

// sets the amount of seconds per interval (60 = 60 second intervals)
const INTERVAL = 60;

const fadeIn = (audio: HTMLAudioElement, duration = 10000) => {
  const interval = 25;
  const steps = duration / interval;
  const volumeIncrement = 1 / steps;

  const fadeTimer = setInterval(() => {
    if (audio.volume < 1) {
      audio.volume = Math.min(1, audio.volume + volumeIncrement);
    } else {
      clearInterval(fadeTimer);
    }
  }, interval);

  return fadeTimer; // Return timer so it can be cleared if needed
};

const fadeOut = (audio: HTMLAudioElement, duration = 10000) => {
  const interval = 25;
  const steps = duration / interval;
  const volumeDecrement = 1 / steps;

  const fadeTimer = setInterval(() => {
    if (audio.volume > 0) {
      audio.volume = Math.max(0, audio.volume - volumeDecrement);
    } else {
      clearInterval(fadeTimer);
    }
  }, interval);

  return fadeTimer;
};

interface ClockProps {
  seconds: number;
}

function Clock({ seconds }: ClockProps) {
  const secondsDegree = (360 / 60) * (seconds % 60);
  const minutesDegree = (360 / (60 * 60)) * (seconds % (60 * 60));
  const hoursDegree = (360 / (60 * 60 * 12)) * (seconds % (60 * 60 * 12));

  return (
    <div className="relative w-fit">
      <img src="Ellipse 1.svg" alt="Circle" />
      <img
        style={{
          transform: `rotate(${hoursDegree}deg)`,
        }}
        className={`absolute bottom-1/2 left-1/2 origin-bottom`}
        src="Hours.svg"
        alt="Circle"
      />
      <img
        style={{
          transform: `rotate(${minutesDegree}deg)`,
        }}
        className={`absolute bottom-1/2 left-1/2 origin-bottom`}
        src="Minutes.svg"
        alt="Circle"
      />
      <img
        style={{
          transform: `rotate(${secondsDegree}deg)`,
        }}
        className={`absolute bottom-1/2 left-1/2 origin-bottom`}
        src="Seconds.svg"
        alt="Circle"
      />
    </div>
  );
}

interface ProgressBarProps {
  numerator: number;
  denominator: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  numerator,
  denominator,
  className = "",
}) => {
  const percentage = (numerator / denominator) * 100;

  return (
    <div className={`w-full ${className}`}>
      <div className="h-4 w-full bg-gray-300 rounded-md overflow-hidden">
        <div
          className="h-full bg-gray-500"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

interface PomodoroProps {
  pomodoro: number;
  audio: HTMLAudioElement | null;
}

function Pomodoro({ pomodoro, audio }: PomodoroProps) {
  let title: string;
  let numerator: number;
  let denominator: number;
  let cycle: number = 0;

  if (audio) {
    if (pomodoro >= 115 * INTERVAL) {
      fadeOut(audio);
      title = "Long Break";
      numerator = pomodoro - 115 * INTERVAL;
      denominator = 15 * INTERVAL;
      cycle = 0;
    } else if (pomodoro % (30 * INTERVAL) >= 25 * INTERVAL) {
      fadeOut(audio);
      title = "Short Break";
      numerator = (pomodoro % (30 * INTERVAL)) - 25 * INTERVAL;
      denominator = 5 * INTERVAL;
      cycle = Math.floor(pomodoro / (30 * INTERVAL)) + 1;
    } else {
      fadeIn(audio);
      title = "Work time";
      numerator = pomodoro % (30 * INTERVAL);
      denominator = 25 * INTERVAL;
      cycle = Math.floor(pomodoro / (30 * INTERVAL)) + 1;
    }
  
    return (
      <div className="w-[34vw] space-y-3">
        <h1 className="text-center">
          {title} {cycle && cycle > 0 ? <span>#{cycle}</span> : null}
        </h1>
        <ProgressBar numerator={numerator} denominator={denominator} />
      </div>
    );
  }
  return null;
}

function convertUTCDateToLocalDate(date: Date) {
  const newDate = new Date(
    date.getTime() + date.getTimezoneOffset() * 60 * 1000
  );

  const offset = date.getTimezoneOffset() / 60;
  const hours = date.getHours();

  newDate.setHours(hours - offset);

  return newDate;
}

export default function PomodoroPage() {
  const [elapsed, setElapsed] = useState(0);
  const [pomodoro, setPomodoro] = useState(0);
  const [audio, setAudio] = useState(null as HTMLAudioElement | null);

  useEffect(() => {
    setAudio(new Audio("white_noise.mp3"));
  }, [])

  useEffect(() => {
    // Start with volume 0
    if (audio) {
      audio.volume = 0;
      audio.loop = true;
      audio.play();
  
      const inTimer = fadeIn(audio);
  
      // Cleanup function to clear interval if component unmounts
      return () => clearInterval(inTimer);
    }
  }, [audio]);

  useEffect(() => {
    const updateTime = () => {
      const janFirstSeconds = new Date(2025, 0, 1).valueOf() / 1000;
      const currentDate = convertUTCDateToLocalDate(
        new Date(Date.now())
      ).valueOf(); // EST (UTC-5) i.e. 5 hours behind UTC
      const currentSeconds = currentDate / 1000;

      // (25 * 4) + (5 * 3) + 15 = 130
      // seconds = x minutes * 60s/m
      const pomodoroSeconds = 130 * INTERVAL;

      setElapsed(currentSeconds);
      setPomodoro((currentSeconds - janFirstSeconds) % pomodoroSeconds);
    };

    updateTime();

    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="w-screen min-h-screen font-thin bg-black text-white flex flex-col items-center justify-center space-y-3">
      <Clock seconds={elapsed} />
      <Pomodoro pomodoro={pomodoro} audio={audio} />
    </div>
  );
}
