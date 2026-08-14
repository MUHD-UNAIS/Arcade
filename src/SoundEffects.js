// Web Audio API Synthesizer for Lumina Zen
class SoundEffects {
  constructor() {
    this.ctx = null;
    this.ambientOsc1 = null;
    this.ambientOsc2 = null;
    this.ambientGain = null;
    this.isAmbientPlaying = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick() {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {
      console.warn("Audio play error", e);
    }
  }

  playToggle(enabled) {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      const freq1 = enabled ? 440 : 660;
      const freq2 = enabled ? 880 : 330;

      osc.frequency.setValueAtTime(freq1, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq2, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) {
      console.warn("Audio play error", e);
    }
  }

  playLaunch() {
    this.init();
    if (!this.ctx) return;
    try {
      const notes = [329.63, 440, 554.37, 659.25]; // E4, A4, C#5, E5
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.07);

        gain.gain.setValueAtTime(0.08, this.ctx.currentTime + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.07 + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + idx * 0.07);
        osc.stop(this.ctx.currentTime + idx * 0.07 + 0.25);
      });
    } catch (e) {
      console.warn("Audio play error", e);
    }
  }

  toggleAmbient(enable) {
    this.init();
    if (!this.ctx) return;

    if (enable) {
      if (this.isAmbientPlaying) return;
      try {
        this.ambientGain = this.ctx.createGain();
        this.ambientGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        this.ambientGain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 2);

        this.ambientOsc1 = this.ctx.createOscillator();
        this.ambientOsc2 = this.ctx.createOscillator();

        this.ambientOsc1.type = 'sine';
        this.ambientOsc1.frequency.setValueAtTime(220, this.ctx.currentTime); // A3

        this.ambientOsc2.type = 'sine';
        this.ambientOsc2.frequency.setValueAtTime(277.18, this.ctx.currentTime); // C#4

        this.ambientOsc1.connect(this.ambientGain);
        this.ambientOsc2.connect(this.ambientGain);
        this.ambientGain.connect(this.ctx.destination);

        this.ambientOsc1.start();
        this.ambientOsc2.start();
        this.isAmbientPlaying = true;
      } catch (e) {
        console.warn("Ambient sound error", e);
      }
    } else {
      if (this.ambientGain && this.ctx) {
        try {
          this.ambientGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 1);
          setTimeout(() => {
            if (this.ambientOsc1) this.ambientOsc1.stop();
            if (this.ambientOsc2) this.ambientOsc2.stop();
            this.isAmbientPlaying = false;
          }, 1000);
        } catch (e) {
          this.isAmbientPlaying = false;
        }
      }
    }
  }
}

export const sounds = new SoundEffects();
