// Audio Controller for Web Audio synthesis, Harry Potter background music, and Spanish Sorting Hat speech

interface NoteEvent {
  note: number; // frequency in Hz
  duration: number; // in seconds
  pauseAfter: number; // in seconds
}

class MagicalAudioService {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;
  public isMusicPlaying: boolean = false;
  private musicIntervalId: number | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isVoicesLoaded: boolean = false;
  private musicGainNode: GainNode | null = null;
  private activeVoicesListeners: (() => void)[] = [];

  constructor() {
    // Check localStorage preference
    const saved = localStorage.getItem('obras_magic_audio_muted');
    if (saved !== null) {
      this.isMuted = saved === 'true';
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
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
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('obras_magic_audio_muted', String(this.isMuted));
    if (this.isMuted) {
      this.pauseBackgroundMusic();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
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
    if (this.isMuted || this.isMusicPlaying) return;
    this.initCtx();
    if (!this.ctx) return;

    this.isMusicPlaying = true;
    this.playHedwigLoop();
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
      this.musicGainNode.connect(this.ctx.destination);
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
      [C6, 2.0 * b],

      // Phrase 4
      [Gs5, 1.0 * b],
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
          this.playCelestaTone(freq, dur * 1.5, 0.075);
        }
      }, currentOffset * 1000);
      currentOffset += dur;
    });

    // Schedule next loop after melody finishes + 2.5s quiet pause
    const totalDurationMs = (currentOffset + 2.5) * 1000;
    this.musicIntervalId = window.setTimeout(() => {
      this.playHedwigLoop();
    }, totalDurationMs);
  }

  // Duck music volume when Hat speaks so voice is 100% clear
  public duckMusic(duck: boolean) {
    if (!this.ctx || !this.musicGainNode) return;
    const now = this.ctx.currentTime;
    const targetGain = duck ? 0.15 : 0.7;
    this.musicGainNode.gain.linearRampToValueAtTime(targetGain, now + 0.4);
  }

  // --- SOUND EFFECTS (Clean, without buzzing static) ---

  // Play a soft magical chime on card hover
  public playHover() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const freqs = [659.25, 880, 987.77]; // E5, A5, B5
    const f = freqs[Math.floor(Math.random() * freqs.length)];
    osc.frequency.setValueAtTime(f, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(f * 1.4, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

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
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.21);
  }

  // Triumphant wizard chime when selecting an option
  public playSelect() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio

    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0.06, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.36);
    });
  }

  // Suspenseful magical ambient pad (PURE SINE CHORD, ZERO STATIC BUZZING)
  public playSuspenseDrone(): () => void {
    if (this.isMuted) return () => {};
    this.initCtx();
    if (!this.ctx) return () => {};

    // Duck the background music while deliberating
    this.duckMusic(true);

    const now = this.ctx.currentTime;

    // Pure warm sine oscillators (Root E2: 82.4Hz and Fifth B2: 123.47Hz)
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(82.4, now); // E2 deep clean bass

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(123.47, now); // B2 mystical fifth

    // Filter to eliminate any high harmonic click or static
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.045, now + 1.2);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);

    return () => {
      if (this.ctx) {
        gain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.4);
        this.duckMusic(false);
        setTimeout(() => {
          try {
            osc1.stop();
            osc2.stop();
          } catch {
            // ignore
          }
        }, 450);
      }
    };
  }

  // Grand fanfare on house announcement
  public playFanfare() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const chords = [
      { t: 0.0, f: [440, 554.37, 659.25] },     // A major
      { t: 0.25, f: [440, 554.37, 659.25] },
      { t: 0.5, f: [440, 554.37, 659.25] },
      { t: 0.75, f: [587.33, 739.99, 880] },    // D major
      { t: 1.15, f: [659.25, 830.61, 987.77] },   // E major
      { t: 1.6, f: [880, 1108.73, 1318.51] }     // High A major finale
    ];

    chords.forEach(c => {
      c.f.forEach(freq => {
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
        gain.connect(this.ctx!.destination);

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
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + dur);
  }

  // --- SORTING HAT SPANISH VOICE SYNTHESIS ---

  // Select the best Spanish voice (strictly Spanish, prioritizing male wizard voice)
  private getSpanishVoice(): SpeechSynthesisVoice | null {
    if (this.voices.length === 0 && 'speechSynthesis' in window) {
      this.voices = window.speechSynthesis.getVoices();
    }

    const esVoices = this.voices.filter(v => v.lang.toLowerCase().startsWith('es'));
    if (esVoices.length === 0) return null;

    // Prioritize male Spanish voices in Windows / Chromium / Mac
    const maleNames = ['raul', 'pablo', 'jorge', 'diego', 'david', 'carlos', 'alvaro', 'enrique', 'male', 'hombre'];
    const maleVoice = esVoices.find(v => {
      const n = v.name.toLowerCase();
      return maleNames.some(m => n.includes(m));
    });
    if (maleVoice) return maleVoice;

    // Otherwise prioritize Argentina (es-AR) or Spain (es-ES) or Mexico (es-MX)
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

    try {
      const audio = new Audio(`./audio/${clipName}.mp3`);
      audio.volume = 1.0;

      const finish = () => {
        this.duckMusic(false);
        if (onEnd) onEnd();
      };

      audio.onended = finish;
      audio.onerror = () => {
        this.duckMusic(false);
        if (onEnd) onEnd();
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          this.duckMusic(false);
          if (onEnd) onEnd();
        });
      }
    } catch {
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

    // Duck background music during speech
    this.duckMusic(true);

    const executeSpeak = () => {
      window.speechSynthesis.cancel(); // Stop any pending utterances
      const utterance = new SpeechSynthesisUtterance(text);

      const esVoice = this.getSpanishVoice();
      if (esVoice) {
        utterance.voice = esVoice;
        utterance.lang = esVoice.lang;
      } else {
        // ALWAYS enforce Spanish language code so English TTS does NOT take over!
        utterance.lang = 'es-ES';
      }

      // Voice acoustics: deep, measured, wizard-like
      utterance.rate = 0.88;   // Slower, dramatic pacing
      utterance.pitch = 0.76;  // Deep wizard tone
      utterance.volume = 1.0;

      const finish = () => {
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
      // Wait for voices to load
      this.activeVoicesListeners.push(executeSpeak);
      // Timeout fallback in case voices take too long to fire event
      setTimeout(() => {
        if (!this.isVoicesLoaded) {
          executeSpeak();
        }
      }, 350);
    }
  }
}

export const AudioController = new MagicalAudioService();
