import { useState, useEffect, useRef, useCallback } from 'react';
import { playBell, unlockAudio } from '../services/zenAudio';

/**
 * High-Precision Drift-Free Interval Timer Hook
 * 
 * - Uses Date.now() timestamp deltas on a 200ms tick to prevent drift.
 * - Handles intermediate interval transitions and triggers the 528Hz Interval Bell.
 * - Handles session completion and triggers the deep Tibetan Singing Bowl.
 * - Integrates the Screen Wake Lock API to prevent mobile screens from sleeping.
 */
export function useIntervalTimer({
  intervals = 4,
  minutes = 5,
  soundEnabled = true,
  doubleStrike = true,
}) {
  // Timer lifecycle status: 'idle' | 'running' | 'paused' | 'completed'
  const [status, setStatus] = useState('idle');

  // Total milliseconds elapsed across the entire session
  const [sessionElapsedMs, setSessionElapsedMs] = useState(0);

  // Screen Wake Lock active status
  const [isWakeLockActive, setIsWakeLockActive] = useState(false);

  // References for drift-free timestamp tracking
  const startTimeRef = useRef(null);
  const accumulatedMsRef = useRef(0);
  const timerTickRef = useRef(null);
  const wakeLockSentinelRef = useRef(null);

  // Track the last interval index for which the intermediate chime has sounded
  // (0-indexed: when crossing from interval 0 into interval 1, lastChimedIndexRef becomes 0)
  const lastChimedIntervalIndexRef = useRef(0);

  // Current session constants in ms
  const intervalDurationMs = Math.max(1, minutes * 60 * 1000);
  const totalSessionDurationMs = intervals * intervalDurationMs;

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

    // Trigger Final Session Bell (Deep Tibetan Singing Bowl)
    if (soundEnabled) {
      playBell('final', { doubleStrike });
    }
  }, [stopTick, releaseWakeLock, totalSessionDurationMs, soundEnabled, doubleStrike]);

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
    const currentIntervalIndex = Math.floor(totalElapsed / intervalDurationMs);

    // Check if we rolled into a new intermediate interval
    if (currentIntervalIndex > lastChimedIntervalIndexRef.current) {
      // Fire intermediate gentle chime
      if (soundEnabled) {
        playBell('interval');
      }
      lastChimedIntervalIndexRef.current = currentIntervalIndex;
    }
  }, [totalSessionDurationMs, intervalDurationMs, soundEnabled, handleTimerComplete]);

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
      const targetElapsedMs = targetIndex * intervalDurationMs;

      accumulatedMsRef.current = targetElapsedMs;
      startTimeRef.current = status === 'running' ? Date.now() : null;
      lastChimedIntervalIndexRef.current = targetIndex;
      setSessionElapsedMs(targetElapsedMs);
    },
    [intervals, intervalDurationMs, status]
  );

  // Scrub progress within current interval
  const seekIntervalProgress = useCallback(
    (ratio) => {
      const currentIntervalIdx = Math.min(
        intervals - 1,
        Math.floor(sessionElapsedMs / intervalDurationMs)
      );
      const intervalBaseMs = currentIntervalIdx * intervalDurationMs;
      // ratio: 1 (full) down to 0 (empty)
      const remainingInInterval = intervalDurationMs * Math.max(0, Math.min(1, ratio));
      const newElapsedInInterval = intervalDurationMs - remainingInInterval;
      const targetElapsedMs = intervalBaseMs + newElapsedInInterval;

      accumulatedMsRef.current = targetElapsedMs;
      startTimeRef.current = status === 'running' ? Date.now() : null;
      setSessionElapsedMs(targetElapsedMs);
    },
    [intervals, intervalDurationMs, sessionElapsedMs, status]
  );

  // Clean up interval and wake lock on unmount
  useEffect(() => {
    return () => {
      stopTick();
      releaseWakeLock();
    };
  }, [stopTick, releaseWakeLock]);

  // If session parameters (intervals or minutes) change while idle, reset cleanly
  useEffect(() => {
    if (status === 'idle') {
      accumulatedMsRef.current = 0;
      setSessionElapsedMs(0);
      lastChimedIntervalIndexRef.current = 0;
    }
  }, [intervals, minutes, status]);

  /* ========================================================================
     Calculated Output Properties
     ======================================================================== */
  const currentIntervalIndex = Math.min(
    intervals - 1,
    Math.floor(sessionElapsedMs / intervalDurationMs)
  );
  const currentInterval = currentIntervalIndex + 1;

  const elapsedInCurrentIntervalMs = sessionElapsedMs - currentIntervalIndex * intervalDurationMs;
  const remainingInCurrentIntervalMs = Math.max(
    0,
    intervalDurationMs - elapsedInCurrentIntervalMs
  );

  // In completed state, remaining is strictly 0
  const isCompleted = status === 'completed';
  const effectiveRemainingMs = isCompleted ? 0 : remainingInCurrentIntervalMs;

  const remainingSeconds = Math.ceil(effectiveRemainingMs / 1000);
  const minutesDisplay = Math.floor(remainingSeconds / 60);
  const secondsDisplay = remainingSeconds % 60;
  const formattedTime = `${String(minutesDisplay).padStart(2, '0')}:${String(secondsDisplay).padStart(2, '0')}`;

  // Progress for the circular ring: 1.0 (full) down to 0.0 (empty)
  const intervalProgress = isCompleted ? 0 : effectiveRemainingMs / intervalDurationMs;

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
    // Actions
    startTimer,
    pauseTimer,
    togglePlay,
    resetTimer,
    seekToInterval,
    seekIntervalProgress,
  };
}
