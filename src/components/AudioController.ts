// Audio Controller for Web Audio synthesis, Harry Potter background music, and Spanish Sorting Hat speech

interface NoteEvent {
  note: number; // frequency in Hz
  duration: number; // in seconds
  pauseAfter: number; // in seconds
}

export interface OscilloscopeData {
  wave: Uint8Array;
  freq: Uint8Array;
  amplitude: number;
  bass: number;
  isSpeaking: boolean;
}

class MagicalAudioService {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false; // Always ON by default as requested!
  public isMusicPlaying: boolean = true; // Music is active by default!
  private musicIntervalId: number | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isVoicesLoaded: boolean = false;
  private musicGainNode: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private waveBuffer: Uint8Array | null = null;
  private freqBuffer: Uint8Array | null = null;
  private activeVoicesListeners: (() => void)[] = [];
  public isSpeaking: boolean = false;
  private currentAudioElement: HTMLAudioElement | null = null;

  constructor() {
    // Music is enabled by default. Only respect explicit manual mute if set.
    const saved = localStorage.getItem('obras_magic_audio_muted');
    if (saved === 'true') {
      this.isMuted = true;
      this.isMusicPlaying = false;
    } else {
      this.isMuted = false;
      this.isMusicPlaying = true;
    }

    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        this.initVoices();
      }

      // Proactively unlock AudioContext on the very first gesture
      const unlockAudio = () => {
        this.initCtx();
        if (!this.isMuted && !this.musicIntervalId) {
          this.startBackgroundMusic();
        }
      };

      window.addEventListener('click', unlockAudio, { passive: true });
      window.addEventListener('touchstart', unlockAudio, { passive: true });
      window.addEventListener('pointerdown', unlockAudio, { passive: true });
      window.addEventListener('keydown', unlockAudio, { passive: true });
    }
  }

  private initVoices() {
    const updateVoices = () => {
      this.voices = window.speechSynthesis.getVoices();
      if (this.voices.length > 0) {
        this.isVoicesLoaded = true;
        this.activeVoicesListeners.forEach(cb => cb());
        this.activeVoicesListeners = [];
      }
    };

    updateVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }

  public initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    if (this.ctx) {
      if (!this.masterGain) {
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
      }

      if (!this.analyser) {
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 128;
        this.analyser.smoothingTimeConstant = 0.75;
        this.waveBuffer = new Uint8Array(this.analyser.fftSize);
        this.freqBuffer = new Uint8Array(this.analyser.frequencyBinCount);

        this.masterGain.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);
      }

      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    }
  }

  // Real-time audio waveform and frequency data for the Hat oscilloscope
  public getOscilloscopeData(): OscilloscopeData {
    if (!this.analyser || !this.waveBuffer || !this.freqBuffer || this.isMuted) {
      // Fallback synthetic wave when speaking but web audio analyser empty
      const emptyWave = new Uint8Array(64);
      for (let i = 0; i < emptyWave.length; i++) emptyWave[i] = 128;
      return {
        wave: emptyWave,
        freq: new Uint8Array(32),
        amplitude: this.isSpeaking ? 0.35 : 0,
        bass: 0,
        isSpeaking: this.isSpeaking
      };
    }

    this.analyser.getByteTimeDomainData(this.waveBuffer as any);
    this.analyser.getByteFrequencyData(this.freqBuffer as any);

    // Compute amplitude from time domain deviation from 128
    let sumDev = 0;
    for (let i = 0; i < this.waveBuffer.length; i++) {
      sumDev += Math.abs(this.waveBuffer[i] - 128);
    }
    const rawAmp = sumDev / (this.waveBuffer.length * 128);

    // Bass energy from lowest bins
    const bass = (this.freqBuffer[0] + this.freqBuffer[1] + this.freqBuffer[2]) / (3 * 255);

    // If speaking, ensure minimum visible oscillation
    const amplitude = this.isSpeaking ? Math.max(rawAmp, 0.32) : rawAmp;

    return {
      wave: this.waveBuffer,
      freq: this.freqBuffer,
      amplitude,
      bass,
      isSpeaking: this.isSpeaking
    };
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('obras_magic_audio_muted', String(this.isMuted));
    if (this.isMuted) {
      this.pauseBackgroundMusic();
      if (this.currentAudioElement) {
        this.currentAudioElement.pause();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      this.isSpeaking = false;
    } else {
      this.playChime(523.25, 'triangle', 0.15);
      this.startBackgroundMusic();
    }
    return this.isMuted;
  }

  // --- BACKGROUND MUSIC: HEDWIG'S THEME (Tranquil Celesta / Bells) ---

  public toggleBackgroundMusic(): boolean {
    if (this.isMusicPlaying) {
      this.pauseBackgroundMusic();
    } else {
      this.startBackgroundMusic();
    }
    return this.isMusicPlaying;
  }

  public startBackgroundMusic() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    this.isMusicPlaying = true;
    if (!this.musicIntervalId) {
      this.playHedwigLoop();
    }
  }

  public pauseBackgroundMusic() {
    this.isMusicPlaying = false;
    if (this.musicIntervalId !== null) {
      window.clearTimeout(this.musicIntervalId);
      this.musicIntervalId = null;
    }
  }

  // Celesta note synthesis
  private playCelestaTone(freq: number, duration: number, gainLevel: number = 0.08) {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;

    // Primary bell tone
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    // Overtone shimmer (glassy bell characteristic of celesta)
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 3.01, now);

    // Soft warm filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2200, now);

    const gain1 = this.ctx.createGain();
    const gain2 = this.ctx.createGain();

    // Envelope for main bell
    gain1.gain.setValueAtTime(0.0001, now);
    gain1.gain.linearRampToValueAtTime(gainLevel, now + 0.01);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    // Envelope for glassy shimmer
    gain2.gain.setValueAtTime(0.0001, now);
    gain2.gain.linearRampToValueAtTime(gainLevel * 0.22, now + 0.008);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.45);

    osc1.connect(gain1);
    osc2.connect(gain2);

    gain1.connect(filter);
    gain2.connect(filter);

    if (!this.musicGainNode) {
      this.musicGainNode = this.ctx.createGain();
      this.musicGainNode.gain.setValueAtTime(0.7, now);
      if (this.masterGain) {
        this.musicGainNode.connect(this.masterGain);
      } else {
        this.musicGainNode.connect(this.ctx.destination);
      }
    }

    filter.connect(this.musicGainNode);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration + 0.1);
    osc2.stop(now + duration + 0.1);
  }

  // Play peaceful Hedwig's Theme melody loop in E minor / B minor
  private playHedwigLoop() {
    if (!this.isMusicPlaying || this.isMuted || !this.ctx) return;

    // Frequencies (Hz)
    const B4 = 493.88;
    const E5 = 659.25;
    const G5 = 783.99;
    const Fs5 = 739.99;
    const B5 = 987.77;
    const A5 = 880.00;
    const Ds5 = 622.25;
    const F5 = 698.46;
    const D6 = 1174.66;
    const Cs6 = 1108.73;
    const C6 = 1046.50;
    const Gs5 = 830.61;
    const As5 = 932.33;

    // Tempo: tranquil 3/4 waltz, beat ~ 0.55s
    const b = 0.55;

    // Iconic melody notes: [freq, durationInBeats]
    const melody: [number, number][] = [
      // Phrase 1
      [B4, 1.0 * b],
      [E5, 1.5 * b],
      [G5, 0.5 * b],
      [Fs5, 1.0 * b],
      [E5, 2.0 * b],
      [B5, 1.0 * b],
      [A5, 2.5 * b],
      [Fs5, 2.5 * b],

      // Phrase 2
      [E5, 1.5 * b],
      [G5, 0.5 * b],
      [Fs5, 1.0 * b],
      [Ds5, 2.0 * b],
      [F5, 1.0 * b],
      [B4, 3.0 * b],

      // Phrase 3
      [B4, 1.0 * b],
      [E5, 1.5 * b],
      [G5, 0.5 * b],
      [Fs5, 1.0 * b],
      [E5, 2.0 * b],
      [B5, 1.0 * b],
      [D6, 2.0 * b],
      [Cs6, 1.0 * b],
      [C6, 2.5 * b],
      [Gs5, 2.0 * b],

      // Phrase 4
      [C6, 1.5 * b],
      [B5, 0.5 * b],
      [As5, 1.0 * b],
      [B4, 2.0 * b],
      [G5, 1.0 * b],
      [E5, 3.5 * b]
    ];

    let currentOffset = 0;
    melody.forEach(([freq, dur]) => {
      window.setTimeout(() => {
        if (this.isMusicPlaying && !this.isMuted) {
          this.playCelestaTone(freq, dur, 0.085);
        }
      }, currentOffset * 1000);
      currentOffset += dur + 0.05;
    });

    // Schedule next loop with a pleasant mystical pause
    const loopDuration = (currentOffset + 3.0) * 1000;
    this.musicIntervalId = window.setTimeout(() => {
      this.musicIntervalId = null;
      if (this.isMusicPlaying && !this.isMuted) {
        this.playHedwigLoop();
      }
    }, loopDuration);
  }

  // Duck music volume when Sorting Hat is speaking or deliberating
  public duckMusic(duck: boolean) {
    if (!this.ctx || !this.musicGainNode) return;
    const now = this.ctx.currentTime;
    const target = duck ? 0.12 : 0.7;
    this.musicGainNode.gain.cancelScheduledValues(now);
    this.musicGainNode.gain.linearRampToValueAtTime(target, now + 0.4);
  }

  // --- UI SOUND EFFECTS ---

  // Play magical twinkle when hovering or tapping an option
  public playHover() {
    this.playSparkle();
  }

  public playSparkle() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const freqs = [659.25, 880, 987.77];
    const f = freqs[Math.floor(Math.random() * freqs.length)];
    osc.frequency.setValueAtTime(f, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(f * 1.4, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    if (this.masterGain) {
      gain.connect(this.masterGain);
    } else {
      gain.connect(this.ctx.destination);
    }

    osc.start();
    osc.stop(this.ctx.currentTime + 0.16);
  }

  // Play a soft wand whoosh
  public playSwoosh() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(700, this.ctx.currentTime + 0.08);
    osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.2);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

    osc.connect(filter);
    filter.connect(gain);
    if (this.masterGain) {
      gain.connect(this.masterGain);
    } else {
      gain.connect(this.ctx.destination);
    }

    osc.start();
    osc.stop(this.ctx.currentTime + 0.21);
  }

  // Triumphant wizard chime when selecting an option
  public playSelect() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];

    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0.06, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.35);

      osc.connect(gain);
      if (this.masterGain) {
        gain.connect(this.masterGain);
      } else {
        gain.connect(this.ctx!.destination);
      }

      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.36);
    });
  }

  // Suspenseful magical ambient pad (PURE SINE CHORD, ZERO STATIC BUZZING)
  public playSuspenseDrone(): () => void {
    if (this.isMuted) return () => {};
    this.initCtx();
    if (!this.ctx) return () => {};

    this.duckMusic(true);
    const now = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(82.4, now);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(123.47, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(420, now);
    filter.Q.setValueAtTime(1.2, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 1.2);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);

    if (this.masterGain) {
      gain.connect(this.masterGain);
    } else {
      gain.connect(this.ctx.destination);
    }

    osc1.start(now);
    osc2.start(now);

    return () => {
      if (!this.ctx) return;
      const stopTime = this.ctx.currentTime;
      gain.gain.cancelScheduledValues(stopTime);
      gain.gain.linearRampToValueAtTime(0.0001, stopTime + 0.6);
      osc1.stop(stopTime + 0.65);
      osc2.stop(stopTime + 0.65);
      this.duckMusic(false);
    };
  }

  // Fanfare played on house reveal
  public playFanfare(house: string = 'gryffindor') {
    this.playHouseFanfare(house);
  }

  public playHouseFanfare(house: string = 'gryffindor') {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    this.duckMusic(true);
    const now = this.ctx.currentTime;

    let chords: { notes: number[]; t: number }[] = [];
    if (house === 'gryffindor') {
      chords = [
        { notes: [261.63, 329.63, 392.00], t: 0 },
        { notes: [329.63, 392.00, 523.25], t: 0.3 },
        { notes: [392.00, 523.25, 659.25], t: 0.65 },
        { notes: [523.25, 659.25, 783.99, 1046.5], t: 1.05 }
      ];
    } else if (house === 'slytherin') {
      chords = [
        { notes: [220.00, 261.63, 329.63], t: 0 },
        { notes: [261.63, 329.63, 440.00], t: 0.3 },
        { notes: [329.63, 440.00, 523.25], t: 0.65 },
        { notes: [440.00, 523.25, 659.25, 880.00], t: 1.05 }
      ];
    } else if (house === 'ravenclaw') {
      chords = [
        { notes: [293.66, 369.99, 440.00], t: 0 },
        { notes: [369.99, 440.00, 587.33], t: 0.3 },
        { notes: [440.00, 587.33, 739.99], t: 0.65 },
        { notes: [587.33, 739.99, 880.00, 1174.66], t: 1.05 }
      ];
    } else {
      chords = [
        { notes: [261.63, 329.63, 392.00], t: 0 },
        { notes: [293.66, 369.99, 440.00], t: 0.3 },
        { notes: [329.63, 392.00, 523.25], t: 0.65 },
        { notes: [392.00, 523.25, 659.25, 783.99], t: 1.05 }
      ];
    }

    chords.forEach(c => {
      c.notes.forEach(freq => {
        const osc = this.ctx!.createOscillator();
        const filter = this.ctx!.createBiquadFilter();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + c.t);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2400, now + c.t);

        gain.gain.setValueAtTime(0.045, now + c.t);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + c.t + 0.42);

        osc.connect(filter);
        filter.connect(gain);
        if (this.masterGain) {
          gain.connect(this.masterGain);
        } else {
          gain.connect(this.ctx!.destination);
        }

        osc.start(now + c.t);
        osc.stop(now + c.t + 0.45);
      });
    });
  }

  private playChime(freq: number, type: OscillatorType, dur: number) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + dur);
    osc.connect(gain);
    if (this.masterGain) {
      gain.connect(this.masterGain);
    } else {
      gain.connect(this.ctx.destination);
    }
    osc.start();
    osc.stop(this.ctx.currentTime + dur);
  }

  // --- SORTING HAT SPANISH VOICE SYNTHESIS ---

  private getSpanishVoice(): SpeechSynthesisVoice | null {
    if (this.voices.length === 0 && 'speechSynthesis' in window) {
      this.voices = window.speechSynthesis.getVoices();
    }

    const esVoices = this.voices.filter(v => v.lang.toLowerCase().startsWith('es'));
    if (esVoices.length === 0) return null;

    const maleNames = ['raul', 'pablo', 'jorge', 'diego', 'david', 'carlos', 'alvaro', 'enrique', 'male', 'hombre'];
    const maleVoice = esVoices.find(v => {
      const n = v.name.toLowerCase();
      return maleNames.some(m => n.includes(m));
    });
    if (maleVoice) return maleVoice;

    const regionalVoice = esVoices.find(v => v.lang.toLowerCase().includes('es-ar') || v.lang.toLowerCase().includes('es-es')) || esVoices[0];
    return regionalVoice;
  }

  // Play official studio-quality deep neural Spanish Sorting Hat voice
  public playHatAudio(
    clipName: 'welcome' | 'deliberation' | 'tiebreak' | 'gryffindor' | 'hufflepuff' | 'ravenclaw' | 'slytherin',
    onEnd?: () => void
  ) {
    if (this.isMuted) {
      if (onEnd) onEnd();
      return;
    }

    this.initCtx();
    this.duckMusic(true);
    this.isSpeaking = true;

    try {
      if (this.currentAudioElement) {
        this.currentAudioElement.pause();
        this.currentAudioElement = null;
      }

      const audio = new Audio(`./audio/${clipName}.mp3`);
      audio.volume = 1.0;
      this.currentAudioElement = audio;

      // Connect HTML Audio to Web Audio Analyser if supported
      try {
        if (this.ctx && this.masterGain) {
          const source = this.ctx.createMediaElementSource(audio);
          source.connect(this.masterGain);
        }
      } catch {
        // Already connected or browser restrictions, audio will still play natively
      }

      const finish = () => {
        this.isSpeaking = false;
        this.duckMusic(false);
        this.currentAudioElement = null;
        if (onEnd) onEnd();
      };

      audio.onended = finish;
      audio.onerror = () => {
        finish();
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser policy prevents audio.play(), fallback to speech synthesis
          this.isSpeaking = false;
          this.duckMusic(false);
          if (onEnd) onEnd();
        });
      }
    } catch {
      this.isSpeaking = false;
      this.duckMusic(false);
      if (onEnd) onEnd();
    }
  }

  // Voice synthesis fallback for the Sorting Hat in Spanish (deep pitch)
  public speakHat(text: string, onEnd?: () => void) {
    if (this.isMuted || !('speechSynthesis' in window)) {
      if (onEnd) setTimeout(onEnd, 2200);
      return;
    }

    this.duckMusic(true);
    this.isSpeaking = true;

    const executeSpeak = () => {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);

      const esVoice = this.getSpanishVoice();
      if (esVoice) {
        utterance.voice = esVoice;
        utterance.lang = esVoice.lang;
      } else {
        utterance.lang = 'es-ES';
      }

      utterance.rate = 0.88;
      utterance.pitch = 0.76;
      utterance.volume = 1.0;

      const finish = () => {
        this.isSpeaking = false;
        this.duckMusic(false);
        if (onEnd) onEnd();
      };

      utterance.onend = finish;
      utterance.onerror = finish;

      window.speechSynthesis.speak(utterance);
    };

    if (this.isVoicesLoaded || this.voices.length > 0) {
      executeSpeak();
    } else {
      this.activeVoicesListeners.push(executeSpeak);
      setTimeout(() => {
        if (!this.isVoicesLoaded) {
          executeSpeak();
        }
      }, 350);
    }
  }
}

export const AudioController = new MagicalAudioService();
