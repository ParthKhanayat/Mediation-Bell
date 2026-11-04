/**
 * Zen Audio Synthesizer & Sound Module
 * 
 * Generates pure meditative chimes and Tibetan singing bowl resonance
 * entirely through the Web Audio API without requiring any external audio files.
 * 
 * Supports mobile browser auto-unlocking and custom .mp3 file path fallback.
 */

// Singleton AudioContext reference
let audioCtx = null;
let isUnlocked = false;

// Active test nodes so user can interrupt/stop if testing repeatedly
let activeNodes = [];

/**
 * Audio Configuration
 * You can set `source: 'file'` and specify a `filePath` (e.g. '/sounds/bell.mp3')
 * to easily swap in custom MP3s at any time.
 */
export const AUDIO_CONFIG = {
  soundEnabled: true,
  intervalBell: {
    source: 'synth', // 'synth' | 'file'
    filePath: '/audio/interval-chime.mp3', // local file path fallback
    frequency: 528, // 528Hz Solfeggio pure chime
    duration: 2.5,
  },
  finalBell: {
    source: 'synth', // 'synth' | 'file'
    filePath: '/audio/singing-bowl.mp3', // local file path fallback
    fundamental: 256, // 256Hz Root
    fifth: 384, // 384Hz Harmonic Fifth
    doubleStrike: true, // Gentle double-strike mode
    duration: 6.0,
  },
};

/**
 * Lazily initialize and return the AudioContext
 */
export function getAudioContext() {
  if (typeof window === 'undefined') return null;

  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }

  return audioCtx;
}

/**
 * Mobile Browser AudioContext Unlock
 * 
 * Crucial for iOS Safari & Android Chrome: resumes AudioContext and plays
 * a 1-sample silent buffer within the user's touch/click gesture.
 */
export async function unlockAudio() {
  const ctx = getAudioContext();
  if (!ctx) return false;

  try {
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    // Play silent micro-buffer to warm up hardware audio pipeline on iOS
    if (!isUnlocked) {
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
      isUnlocked = true;
    }

    return true;
  } catch (err) {
    console.warn('AudioContext unlock failed:', err);
    return false;
  }
}

/**
 * Stop any ongoing sounds
 */
export function stopAllSounds() {
  activeNodes.forEach((node) => {
    try {
      if (node.stop) node.stop();
      if (node.disconnect) node.disconnect();
    } catch {
      // Node might have already finished
    }
  });
  activeNodes = [];
}

/**
 * Synthesize Interval Bell (528Hz Gentle Chime)
 * Soft, pure mid-high frequency strike with subtle harmonic overtone and 2.5s decay.
 */
export function synthesizeIntervalChime({
  volume = 0.6,
  frequency = 528,
  duration = 2.5,
} = {}) {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.connect(ctx.destination);

  // Soft master attack to prevent clipping/pops, then smooth exponential decay
  masterGain.gain.setValueAtTime(0.0001, now);
  masterGain.gain.linearRampToValueAtTime(volume, now + 0.008);
  masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  // Partial 1: Fundamental Sine (528 Hz)
  const oscFundamental = ctx.createOscillator();
  const gainFundamental = ctx.createGain();
  oscFundamental.type = 'sine';
  oscFundamental.frequency.setValueAtTime(frequency, now);
  gainFundamental.gain.setValueAtTime(0.7, now);
  oscFundamental.connect(gainFundamental);
  gainFundamental.connect(masterGain);

  // Partial 2: Pure Harmonic Octave (1056 Hz)
  const oscOctave = ctx.createOscillator();
  const gainOctave = ctx.createGain();
  oscOctave.type = 'sine';
  oscOctave.frequency.setValueAtTime(frequency * 2, now);
  // Octave overtone decays slightly faster for natural acoustic resonance
  gainOctave.gain.setValueAtTime(0.22, now);
  gainOctave.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.7);
  oscOctave.connect(gainOctave);
  gainOctave.connect(masterGain);

  // Partial 3: Subtle High Crystalline Shimmer (1584 Hz, 3rd harmonic)
  const oscShimmer = ctx.createOscillator();
  const gainShimmer = ctx.createGain();
  oscShimmer.type = 'sine';
  oscShimmer.frequency.setValueAtTime(frequency * 3, now);
  gainShimmer.gain.setValueAtTime(0.08, now);
  gainShimmer.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.45);
  oscShimmer.connect(gainShimmer);
  gainShimmer.connect(masterGain);

  // Start oscillators
  oscFundamental.start(now);
  oscOctave.start(now);
  oscShimmer.start(now);

  const stopTime = now + duration;
  oscFundamental.stop(stopTime);
  oscOctave.stop(stopTime);
  oscShimmer.stop(stopTime);

  activeNodes.push(oscFundamental, oscOctave, oscShimmer, masterGain);

  setTimeout(() => {
    activeNodes = activeNodes.filter(
      (n) => n !== oscFundamental && n !== oscOctave && n !== oscShimmer && n !== masterGain
    );
  }, duration * 1000 + 100);
}

/**
 * Helper to synthesize a single Tibetan Singing Bowl strike
 */
function createBowlStrike(ctx, startTime, strikeVolume, duration = 6.0) {
  const masterGain = ctx.createGain();
  masterGain.connect(ctx.destination);

  // Warm attack and long 6.0s resonant decay
  masterGain.gain.setValueAtTime(0.0001, startTime);
  masterGain.gain.linearRampToValueAtTime(strikeVolume, startTime + 0.015);
  masterGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  // Tibetan Singing Bowl Harmonics & Detuned Beating Pairs
  const harmonics = [
    // [Frequency, Detune offset Hz, Relative Amplitude, Decay Factor]
    [256, 0, 0.45, 1.0],      // Fundamental (256Hz)
    [256, 1.6, 0.35, 0.95],   // Detuned Fundamental -> creates ~1.6Hz peaceful acoustic shimmer/beating
    [384, 0, 0.28, 0.90],     // Perfect Fifth (384Hz)
    [384, 2.1, 0.18, 0.85],   // Detuned Fifth -> secondary gentle beat
    [768, 0, 0.07, 0.50],     // 1st Octave Fifth (768Hz) - decays quicker
    [1024, 0, 0.03, 0.35],    // High Tibetan Bell Rim shimmer (1024Hz)
  ];

  harmonics.forEach(([freq, detune, amp, decayFactor]) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq + detune, startTime);

    gain.gain.setValueAtTime(amp, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * decayFactor);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration);
    activeNodes.push(osc);
  });

  activeNodes.push(masterGain);
}

/**
 * Synthesize Final Session Bell (Deep Singing Bowl)
 * Noticeably richer, deeper resonance (256Hz + 384Hz + detuned shimmer)
 * with a warm 6.0s decay and optional gentle double-strike.
 */
export function synthesizeSingingBowl({
  volume = 0.7,
  doubleStrike = true,
  duration = 6.0,
} = {}) {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const now = ctx.currentTime;

  if (doubleStrike) {
    // Primary strike
    createBowlStrike(ctx, now, volume * 0.85, duration);
    // Gentle secondary strike 0.85s later (softer, like a zen master's second bell tap)
    createBowlStrike(ctx, now + 0.85, volume * 0.55, duration * 0.9);
  } else {
    // Single deep resonance strike
    createBowlStrike(ctx, now, volume, duration);
  }
}

/**
 * Extensible Audio Playback Hook
 * Plays either via synthesized Web Audio or local .mp3 file path.
 */
export async function playBell(bellType = 'interval', options = {}) {
  if (!AUDIO_CONFIG.soundEnabled) return;

  await unlockAudio();

  const bellConfig =
    bellType === 'final' ? AUDIO_CONFIG.finalBell : AUDIO_CONFIG.intervalBell;

  // If user configured a custom file and it is enabled:
  if (bellConfig.source === 'file' && bellConfig.filePath) {
    try {
      const audio = new Audio(bellConfig.filePath);
      audio.volume = options.volume ?? 0.7;
      await audio.play();
      return;
    } catch (err) {
      console.warn(
        `Custom audio file '${bellConfig.filePath}' could not be loaded; falling back to synthesizer:`,
        err
      );
      // Fallback seamlessly to Web Audio API synthesis!
    }
  }

  // Synthesizer playback:
  if (bellType === 'final') {
    synthesizeSingingBowl({
      volume: options.volume ?? 0.7,
      doubleStrike: options.doubleStrike ?? bellConfig.doubleStrike,
      duration: bellConfig.duration,
    });
  } else {
    synthesizeIntervalChime({
      volume: options.volume ?? 0.65,
      frequency: bellConfig.frequency,
      duration: bellConfig.duration,
    });
  }
}

/**
 * Test Sound Trigger Helper
 */
export function testBellSound(bellType, customOptions = {}) {
  stopAllSounds();
  return playBell(bellType, customOptions);
}
