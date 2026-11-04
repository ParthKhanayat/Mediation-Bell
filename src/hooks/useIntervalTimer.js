import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { playBell, unlockAudio } from '../services/zenAudio';

/**
 * High-Precision Drift-Free Interval Timer Hook
 * 
 * - Uses Date.now() timestamp deltas on a 200ms tick to prevent drift.
 * - Handles intermediate interval transitions and triggers the 528Hz Interval Bell.
 * - Handles session completion and triggers the deep Tibetan Singing Bowl.
 * - Integrates the Screen Wake Lock API to prevent mobile screens from sleeping.
 * - Supports both uniform minutes and custom individual interval durations.
 */
export function useIntervalTimer({
  intervals = 4,
  minutes = 5,
  isCustomIntervals = false,
  customDurations = null,
  soundEnabled = true,
  doubleStrike = true,
}) {
  // Timer lifecycle status: 'idle' | 'running' | 'paused' | 'completed'
  const [status, setStatus] = useState('idle');

  // Total milliseconds elapsed across the entire session
  const [sessionElapsedMs, setSessionElapsedMs] = useState(0);

  // Screen Wake Lock active status
  const [isWakeLockActive, setIsWakeLockActive] = useState(false);

  // Bell audio visual pulse trigger
  const [isBellRinging, setIsBellRinging] = useState(false);
  const pulseTimeoutRef = useRef(null);

  const triggerBellPulse = useCallback((durationMs = 2800) => {
    setIsBellRinging(true);
    if (pulseTimeoutRef.current) {
      clearTimeout(pulseTimeoutRef.current);
    }
    pulseTimeoutRef.current = setTimeout(() => {
      setIsBellRinging(false);
    }, durationMs);
  }, []);

  // References for drift-free timestamp tracking
  const startTimeRef = useRef(null);
  const accumulatedMsRef = useRef(0);
  const timerTickRef = useRef(null);
  const wakeLockSentinelRef = useRef(null);

  // Track the last interval index for which the intermediate chime has sounded
  // (0-indexed: when crossing from interval 0 into interval 1, lastChimedIndexRef becomes 0)
  const lastChimedIntervalIndexRef = useRef(0);

  // Calculate durations in ms for each interval (supports custom durations or uniform)
  const durationsMs = useMemo(() => {
    if (
      isCustomIntervals &&
      Array.isArray(customDurations) &&
      customDurations.length === intervals
    ) {
      return customDurations.map((m) => Math.max(1, (parseInt(m, 10) || 1) * 60 * 1000));
    }
    return Array(intervals).fill(Math.max(1, minutes * 60 * 1000));
  }, [isCustomIntervals, customDurations, intervals, minutes]);

  const totalSessionDurationMs = useMemo(() => {
    return durationsMs.reduce((acc, d) => acc + d, 0);
  }, [durationsMs]);

  // Helper to determine interval index, duration, and elapsed time at any given ms
  const getIntervalInfoAtElapsed = useCallback(
    (elapsedMs) => {
      let currentIdx = 0;
      let accum = 0;
      let durationMs = durationsMs[0] || 60000;
      let elapsedInInt = 0;

      for (let i = 0; i < durationsMs.length; i++) {
        const d = durationsMs[i];
        if (elapsedMs < accum + d || i === durationsMs.length - 1) {
          currentIdx = i;
          durationMs = d;
          elapsedInInt = Math.max(0, elapsedMs - accum);
          break;
        }
        accum += d;
      }

      const remainingInInt = Math.max(0, durationMs - elapsedInInt);
      return {
        currentIdx,
        durationMs,
        elapsedInInt,
        remainingInInt,
      };
    },
    [durationsMs]
  );

  /* ========================================================================
     Screen Wake Lock API Management
     ======================================================================== */
  const requestWakeLock = useCallback(async () => {
    if (typeof navigator === 'undefined' || !('wakeLock' in navigator)) {
      return;
    }

    try {
      if (!wakeLockSentinelRef.current) {
        const sentinel = await navigator.wakeLock.request('screen');
        wakeLockSentinelRef.current = sentinel;
        setIsWakeLockActive(true);

        sentinel.addEventListener('release', () => {
          wakeLockSentinelRef.current = null;
          setIsWakeLockActive(false);
        });
      }
    } catch (err) {
      console.warn('Screen Wake Lock request failed:', err);
      setIsWakeLockActive(false);
    }
  }, []);

  const releaseWakeLock = useCallback(() => {
    if (wakeLockSentinelRef.current) {
      wakeLockSentinelRef.current.release().catch(() => {});
      wakeLockSentinelRef.current = null;
      setIsWakeLockActive(false);
    }
  }, []);

  // Re-acquire Wake Lock when tab/app becomes visible again if running
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && status === 'running') {
        await requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [status, requestWakeLock]);

  /* ========================================================================
     Timer Tick & Interval Transition Logic (200ms Drift-Free)
     ======================================================================== */
  const stopTick = useCallback(() => {
    if (timerTickRef.current) {
      clearInterval(timerTickRef.current);
      timerTickRef.current = null;
    }
  }, []);

  const handleTimerComplete = useCallback(() => {
    stopTick();
    releaseWakeLock();
    setStatus('completed');
    setSessionElapsedMs(totalSessionDurationMs);

    // Trigger Final Session Bell (Deep Tibetan Singing Bowl) & visual ring pulse
    triggerBellPulse(5500);
    if (soundEnabled) {
      playBell('final', { doubleStrike });
    }
  }, [stopTick, releaseWakeLock, totalSessionDurationMs, soundEnabled, doubleStrike, triggerBellPulse]);

  const tick = useCallback(() => {
    if (!startTimeRef.current) return;

    const now = Date.now();
    const currentRunDelta = now - startTimeRef.current;
    const totalElapsed = accumulatedMsRef.current + currentRunDelta;

    // Check for Session Completion
    if (totalElapsed >= totalSessionDurationMs) {
      handleTimerComplete();
      return;
    }

    setSessionElapsedMs(totalElapsed);

    // Determine current interval index (0 to intervals - 1)
    const { currentIdx } = getIntervalInfoAtElapsed(totalElapsed);

    // Check if we rolled into a new intermediate interval
    if (currentIdx > lastChimedIntervalIndexRef.current) {
      // Fire intermediate gentle chime & visual pulse
      triggerBellPulse(2800);
      if (soundEnabled) {
        playBell('interval');
      }
      lastChimedIntervalIndexRef.current = currentIdx;
    }
  }, [totalSessionDurationMs, getIntervalInfoAtElapsed, soundEnabled, handleTimerComplete, triggerBellPulse]);

  /* ========================================================================
     Control Actions: Start, Pause, Reset, Seek
     ======================================================================== */
  const startTimer = useCallback(async () => {
    // 1. Unlock mobile Web Audio
    await unlockAudio();

    // 2. Request Screen Wake Lock
    await requestWakeLock();

    // 3. Mark start timestamp
    startTimeRef.current = Date.now();
    setStatus('running');

    // 4. Start 200ms high-precision drift-free tick
    stopTick();
    timerTickRef.current = setInterval(tick, 200);
  }, [requestWakeLock, stopTick, tick]);

  const pauseTimer = useCallback(() => {
    if (status !== 'running') return;

    // Accumulate elapsed time up to now
    if (startTimeRef.current) {
      const currentDelta = Date.now() - startTimeRef.current;
      accumulatedMsRef.current += currentDelta;
      setSessionElapsedMs(accumulatedMsRef.current);
      startTimeRef.current = null;
    }

    stopTick();
    releaseWakeLock();
    setStatus('paused');
  }, [status, stopTick, releaseWakeLock]);

  const togglePlay = useCallback(async () => {
    if (status === 'running') {
      pauseTimer();
    } else {
      if (status === 'completed') {
        // Reset if starting over from completed
        accumulatedMsRef.current = 0;
        setSessionElapsedMs(0);
        lastChimedIntervalIndexRef.current = 0;
      }
      await startTimer();
    }
  }, [status, pauseTimer, startTimer]);

  const resetTimer = useCallback(() => {
    stopTick();
    releaseWakeLock();
    startTimeRef.current = null;
    accumulatedMsRef.current = 0;
    lastChimedIntervalIndexRef.current = 0;
    setSessionElapsedMs(0);
    setStatus('idle');
  }, [stopTick, releaseWakeLock]);

  // Scrub or mock jump to an interval for previewing / testing
  const seekToInterval = useCallback(
    (targetIntervalNum) => {
      const clamped = Math.max(1, Math.min(intervals, targetIntervalNum));
      const targetIndex = clamped - 1;
      const targetElapsedMs = durationsMs
        .slice(0, targetIndex)
        .reduce((sum, d) => sum + d, 0);

      accumulatedMsRef.current = targetElapsedMs;
      startTimeRef.current = status === 'running' ? Date.now() : null;
      lastChimedIntervalIndexRef.current = targetIndex;
      setSessionElapsedMs(targetElapsedMs);
    },
    [intervals, durationsMs, status]
  );

  // Scrub progress within current interval
  const seekIntervalProgress = useCallback(
    (ratio) => {
      const { currentIdx, durationMs } = getIntervalInfoAtElapsed(sessionElapsedMs);
      const baseElapsed = durationsMs
        .slice(0, currentIdx)
        .reduce((sum, d) => sum + d, 0);

      // ratio: 1 (full) down to 0 (empty)
      const remainingInInterval = durationMs * Math.max(0, Math.min(1, ratio));
      const newElapsedInInterval = durationMs - remainingInInterval;
      const targetElapsedMs = baseElapsed + newElapsedInInterval;

      accumulatedMsRef.current = targetElapsedMs;
      startTimeRef.current = status === 'running' ? Date.now() : null;
      setSessionElapsedMs(targetElapsedMs);
    },
    [durationsMs, getIntervalInfoAtElapsed, sessionElapsedMs, status]
  );

  // Clean up interval and wake lock on unmount
  useEffect(() => {
    return () => {
      stopTick();
      releaseWakeLock();
    };
  }, [stopTick, releaseWakeLock]);

  // If session parameters change while idle, reset cleanly
  useEffect(() => {
    if (status === 'idle') {
      accumulatedMsRef.current = 0;
      setSessionElapsedMs(0);
      lastChimedIntervalIndexRef.current = 0;
    }
  }, [intervals, minutes, isCustomIntervals, customDurations, status]);

  /* ========================================================================
     Calculated Output Properties
     ======================================================================== */
  const { currentIdx, durationMs, remainingInInt } = getIntervalInfoAtElapsed(sessionElapsedMs);
  const currentInterval = currentIdx + 1;

  // In completed state, remaining is strictly 0
  const isCompleted = status === 'completed';
  const effectiveRemainingMs = isCompleted ? 0 : remainingInInt;

  const remainingSeconds = Math.ceil(effectiveRemainingMs / 1000);
  const minutesDisplay = Math.floor(remainingSeconds / 60);
  const secondsDisplay = remainingSeconds % 60;
  const formattedTime = `${String(minutesDisplay).padStart(2, '0')}:${String(secondsDisplay).padStart(2, '0')}`;

  // Progress for the circular ring: 1.0 (full) down to 0.0 (empty)
  const intervalProgress = isCompleted ? 0 : effectiveRemainingMs / durationMs;

  // Overall session percentage (0% to 100%)
  const totalSessionProgress = Math.min(1, sessionElapsedMs / totalSessionDurationMs);

  return {
    status,
    isPlaying: status === 'running',
    isCompleted,
    currentInterval,
    totalIntervals: intervals,
    minutesPerInterval: minutes,
    remainingSeconds,
    formattedTime,
    intervalProgress,
    totalSessionProgress,
    sessionElapsedMs,
    isWakeLockActive,
    isBellRinging,
    // Actions
    startTimer,
    pauseTimer,
    togglePlay,
    resetTimer,
    seekToInterval,
    seekIntervalProgress,
    triggerBellPulse,
  };
}

