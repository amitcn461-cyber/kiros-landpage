/* KIROS Reel — synthesized SFX engine (Web Audio)
   Subtle, premium UI sounds. All generated, no assets.
   Exposes window.KirosSFX with named one-shots + a timeline cue helper. */
(function () {
  let ctx = null;
  let master = null;
  let unlocked = false;

  function ensure() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.9;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // Single tone with ADSR-ish envelope
  function tone({ freq = 440, dur = 0.18, type = 'sine', gain = 0.18, attack = 0.005, release = 0.12, when = 0, detune = 0, glideTo = null }) {
    const c = ensure(); if (!c) return;
    const t0 = c.currentTime + when;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t0 + dur);
    osc.detune.value = detune;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur + release);
    osc.connect(g); g.connect(master);
    osc.start(t0);
    osc.stop(t0 + dur + release + 0.05);
  }

  // Filtered noise burst (for whooshes / texture)
  function noise({ dur = 0.4, gain = 0.12, when = 0, f0 = 300, f1 = 2200, q = 0.8, type = 'bandpass' }) {
    const c = ensure(); if (!c) return;
    const t0 = c.currentTime + when;
    const len = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = c.createBufferSource(); src.buffer = buf;
    const filt = c.createBiquadFilter(); filt.type = type; filt.Q.value = q;
    filt.frequency.setValueAtTime(f0, t0);
    filt.frequency.exponentialRampToValueAtTime(f1, t0 + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(filt); filt.connect(g); g.connect(master);
    src.start(t0); src.stop(t0 + dur + 0.05);
  }

  const SFX = {
    unlock() {
      const c = ensure();
      if (c && !unlocked) {
        // play a silent blip to satisfy autoplay policies
        const g = c.createGain(); g.gain.value = 0.0001; g.connect(master);
        const o = c.createOscillator(); o.connect(g); o.start(); o.stop(c.currentTime + 0.02);
        unlocked = true;
      }
    },
    // Incoming Instagram DM — friendly two-tone rise
    ping() {
      tone({ freq: 740, dur: 0.07, type: 'triangle', gain: 0.16, release: 0.05 });
      tone({ freq: 1100, dur: 0.12, type: 'triangle', gain: 0.15, when: 0.07, release: 0.12 });
    },
    // Repeated / nagging incoming — slightly sharper & flatter
     pingUrgent() {
      tone({ freq: 880, dur: 0.06, type: 'square', gain: 0.10, release: 0.04 });
      tone({ freq: 880, dur: 0.09, type: 'triangle', gain: 0.13, when: 0.09, release: 0.08 });
    },
    typing() {
      tone({ freq: 320, dur: 0.02, type: 'square', gain: 0.05, release: 0.02 });
    },
    whoosh() {
      noise({ dur: 0.5, gain: 0.13, f0: 240, f1: 2600, q: 0.7 });
      tone({ freq: 200, dur: 0.3, type: 'sine', gain: 0.08, glideTo: 520, release: 0.2 });
    },
    whooshDown() {
      noise({ dur: 0.45, gain: 0.10, f0: 2200, f1: 220, q: 0.7 });
    },
    // Lost the lead — low descending, slightly sour
    lost() {
      tone({ freq: 360, dur: 0.5, type: 'sawtooth', gain: 0.10, glideTo: 150, release: 0.3 });
      tone({ freq: 363, dur: 0.5, type: 'sine', gain: 0.07, glideTo: 150, release: 0.3, detune: -8 });
    },
    // Competitor instant reply — crisp confirm
    confirm() {
      tone({ freq: 660, dur: 0.07, type: 'sine', gain: 0.14, release: 0.05 });
      tone({ freq: 990, dur: 0.13, type: 'sine', gain: 0.14, when: 0.08, release: 0.12 });
    },
    // Tag pop (hot/cold/etc)
    pop() {
      tone({ freq: 520, dur: 0.04, type: 'triangle', gain: 0.12, glideTo: 880, release: 0.05 });
    },
    // KIROS reply / positive system action
    success() {
      tone({ freq: 587, dur: 0.10, type: 'sine', gain: 0.13, release: 0.08 });
      tone({ freq: 880, dur: 0.16, type: 'sine', gain: 0.13, when: 0.10, release: 0.14 });
    },
    // Summary card materialize — soft swell
    materialize() {
      noise({ dur: 0.6, gain: 0.06, f0: 600, f1: 3200, q: 1.2 });
      tone({ freq: 440, dur: 0.4, type: 'sine', gain: 0.07, glideTo: 660, release: 0.3 });
    },
    // Ending brand chime — bright triad
    chime() {
      tone({ freq: 523, dur: 0.5, type: 'triangle', gain: 0.12, release: 0.5 });
      tone({ freq: 659, dur: 0.5, type: 'triangle', gain: 0.11, when: 0.06, release: 0.5 });
      tone({ freq: 784, dur: 0.6, type: 'triangle', gain: 0.12, when: 0.12, release: 0.6 });
      tone({ freq: 1046, dur: 0.7, type: 'sine', gain: 0.09, when: 0.18, release: 0.7 });
    },
    tick() {
      tone({ freq: 1400, dur: 0.015, type: 'square', gain: 0.035, release: 0.02 });
    },
  };

  window.KirosSFX = SFX;
})();
