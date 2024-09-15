"use client";
import { useState, useRef, useEffect, ChangeEvent } from "react";
import { Input } from "@/components/ui/input"; // Import input component from shadcn
import { Button } from "@/components/ui/button"; // Import button component from shadcn

export default function Countdown() {
    const [duration, setDuration] = useState<number | string>(""); // State for the input duration
    const [timeLeft, setTimeLeft] = useState<number>(0); // State for the remaining time
    const [isActive, setIsActive] = useState<boolean>(false); // To check if timer is active
    const [isPaused, setIsPaused] = useState<boolean>(false); // To check if timer is paused
    const timerRef = useRef<NodeJS.Timeout | null>(null); // Reference to the timer interval
  
    // Handle the setting of the duration
    const handleSetDuration = (): void => {
      if (typeof duration === "number" && duration > 0) {
        setTimeLeft(duration);
        setIsActive(false);
        setIsPaused(false);
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
    };
  
    // Handle the start button click
    const handleStart = (): void => {
      if (timeLeft > 0) {
        setIsActive(true);
        setIsPaused(false);
      }
    };
  
    // Handle the pause button click
    const handlePause = (): void => {
      if (isActive) {
        setIsPaused(true);
        setIsActive(false);
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
    };
  
    // Handle the reset button click
    const handleReset = (): void => {
      setIsActive(false);
      setIsPaused(false);
      setTimeLeft(typeof duration === "number" ? duration : 0);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  
    // Timer logic using useEffect
    useEffect(() => {
      if (isActive && !isPaused) {
        timerRef.current = setInterval(() => {
          setTimeLeft((prevTime) => {
            if (prevTime <= 1) {
              clearInterval(timerRef.current!);
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);
      }
  
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }, [isActive, isPaused]);
  
    // Format the time to display in minutes and seconds
    const formatTime = (time: number): string => {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };
  
    // Handle input change
    const handleDurationChange = (e: ChangeEvent<HTMLInputElement>): void => {
      setDuration(Number(e.target.value) || "");
    };
  
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-teal-400 to-blue-500">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
            <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200 text-center">
              Countdown Timer
            </h1>
            <div className="flex items-center mb-6">
              <Input
                type="number"
                id="duration"
                placeholder="Enter duration in seconds"
                value={duration}
                onChange={handleDurationChange}
                className="flex-1 mr-4 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              />
              <Button
                onClick={handleSetDuration}
                variant="outline"
                className="bg-green-500 text-white hover:bg-green-600 transition duration-300"
              >
                Set
              </Button>
            </div>
            <div className="text-6xl font-bold text-gray-800 dark:text-gray-200 mb-8 text-center">
              {formatTime(timeLeft)}
            </div>
            <div className="flex justify-center gap-4">
              <Button
                onClick={handleStart}
                variant="outline"
                className="bg-blue-500 text-white hover:bg-blue-600 transition duration-300"
              >
                {isPaused ? "Resume" : "Start"}
              </Button>
              <Button
                onClick={handlePause}
                variant="outline"
                className="bg-yellow-500 text-white hover:bg-yellow-600 transition duration-300"
              >
                Pause
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="bg-red-500 text-white hover:bg-red-600 transition duration-300"
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      );
  }
  