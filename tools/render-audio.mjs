// Renders the KIROS Reel's synthesized SFX offline (OfflineAudioContext in
// headless Chrome) to a WAV, faithfully reproducing the synth in reel/sfx.js
// and the cue schedule in reel/app.jsx. Output: tools/reel.wav
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUT = path.join(__dirname, 'reel.wav');
const DURATION = 35.0;

const b64 = await (async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
  const page = await browser.newPage();
  page.on('pageerror', (e) => console.error('PAGE ERROR:', e.message));
  const res = await page.evaluate(async (DURATION) => {
    const SR = 44100;
    const ctx = new OfflineAudioContext(1, Math.ceil(DURATION * SR), SR);
    const master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);

    // base = absolute start time for the current cue
    let base = 0;
    function tone({ freq = 440, dur = 0.18, type = 'sine', gain = 0.18, attack = 0.005, release = 0.12, when = 0, detune = 0, glideTo = null }) {
      const t0 = base + when;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t0);
      if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t0 + dur);
      osc.detune.value = detune;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(gain, t0 + attack);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur + release);
      osc.connect(g); g.connect(master);
      osc.start(t0); osc.stop(t0 + dur + release + 0.05);
    }
    function noise({ dur = 0.4, gain = 0.12, when = 0, f0 = 300, f1 = 2200, q = 0.8, type = 'bandpass' }) {
      const t0 = base + when;
      const len = Math.floor(SR * dur);
      const buf = ctx.createBuffer(1, len, SR);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
      const src = ctx.createBufferSource(); src.buffer = buf;
      const filt = ctx.createBiquadFilter(); filt.type = type; filt.Q.value = q;
      filt.frequency.setValueAtTime(f0, t0);
      filt.frequency.exponentialRampToValueAtTime(f1, t0 + dur);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(gain, t0 + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      src.connect(filt); filt.connect(g); g.connect(master);
      src.start(t0); src.stop(t0 + dur + 0.05);
    }

    const SFX = {
      ping() { tone({ freq: 740, dur: 0.07, type: 'triangle', gain: 0.16, release: 0.05 }); tone({ freq: 1100, dur: 0.12, type: 'triangle', gain: 0.15, when: 0.07, release: 0.12 }); },
      pingUrgent() { tone({ freq: 880, dur: 0.06, type: 'square', gain: 0.10, release: 0.04 }); tone({ freq: 880, dur: 0.09, type: 'triangle', gain: 0.13, when: 0.09, release: 0.08 }); },
      whoosh() { noise({ dur: 0.5, gain: 0.13, f0: 240, f1: 2600, q: 0.7 }); tone({ freq: 200, dur: 0.3, type: 'sine', gain: 0.08, glideTo: 520, release: 0.2 }); },
      whooshDown() { noise({ dur: 0.45, gain: 0.10, f0: 2200, f1: 220, q: 0.7 }); },
      lost() { tone({ freq: 360, dur: 0.5, type: 'sawtooth', gain: 0.10, glideTo: 150, release: 0.3 }); tone({ freq: 363, dur: 0.5, type: 'sine', gain: 0.07, glideTo: 150, release: 0.3, detune: -8 }); },
      confirm() { tone({ freq: 660, dur: 0.07, type: 'sine', gain: 0.14, release: 0.05 }); tone({ freq: 990, dur: 0.13, type: 'sine', gain: 0.14, when: 0.08, release: 0.12 }); },
      pop() { tone({ freq: 520, dur: 0.04, type: 'triangle', gain: 0.12, glideTo: 880, release: 0.05 }); },
      success() { tone({ freq: 587, dur: 0.10, type: 'sine', gain: 0.13, release: 0.08 }); tone({ freq: 880, dur: 0.16, type: 'sine', gain: 0.13, when: 0.10, release: 0.14 }); },
      materialize() { noise({ dur: 0.6, gain: 0.06, f0: 600, f1: 3200, q: 1.2 }); tone({ freq: 440, dur: 0.4, type: 'sine', gain: 0.07, glideTo: 660, release: 0.3 }); },
      chime() { tone({ freq: 523, dur: 0.5, type: 'triangle', gain: 0.12, release: 0.5 }); tone({ freq: 659, dur: 0.5, type: 'triangle', gain: 0.11, when: 0.06, release: 0.5 }); tone({ freq: 784, dur: 0.6, type: 'triangle', gain: 0.12, when: 0.12, release: 0.6 }); tone({ freq: 1046, dur: 0.7, type: 'sine', gain: 0.09, when: 0.18, release: 0.7 }); },
      tick() { tone({ freq: 1400, dur: 0.015, type: 'square', gain: 0.035, release: 0.02 }); },
    };

    const CUES = [
      [0.15, 'whoosh'], [2.15, 'ping'], [5.4, 'pingUrgent'], [6.0, 'tick'], [7.0, 'tick'],
      [7.6, 'pingUrgent'], [8.2, 'tick'], [11.4, 'lost'], [12.7, 'whooshDown'], [14.6, 'confirm'],
      [17.25, 'whoosh'], [18.9, 'success'], [20.3, 'success'], [21.6, 'pop'], [22.1, 'pop'],
      [22.6, 'pop'], [23.1, 'pop'], [25.85, 'materialize'], [26.9, 'pop'], [27.4, 'pop'],
      [28.0, 'pop'], [28.7, 'success'], [31.15, 'whoosh'], [31.3, 'chime'],
    ];
    for (const [t, name] of CUES) { base = t; SFX[name](); }

    const rendered = await ctx.startRendering();
    const ch = rendered.getChannelData(0);

    // → 16-bit PCM mono WAV
    const n = ch.length;
    const buf = new ArrayBuffer(44 + n * 2);
    const dv = new DataView(buf);
    const ws = (off, s) => { for (let i = 0; i < s.length; i++) dv.setUint8(off + i, s.charCodeAt(i)); };
    ws(0, 'RIFF'); dv.setUint32(4, 36 + n * 2, true); ws(8, 'WAVE'); ws(12, 'fmt ');
    dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, 1, true);
    dv.setUint32(24, SR, true); dv.setUint32(28, SR * 2, true); dv.setUint16(32, 2, true);
    dv.setUint16(34, 16, true); ws(36, 'data'); dv.setUint32(40, n * 2, true);
    for (let i = 0; i < n; i++) {
      let v = Math.max(-1, Math.min(1, ch[i]));
      dv.setInt16(44 + i * 2, v < 0 ? v * 0x8000 : v * 0x7fff, true);
    }
    const bytes = new Uint8Array(buf);
    let bin = ''; const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
    return btoa(bin);
  }, DURATION);
  await browser.close();
  return res;
})();

fs.writeFileSync(OUT, Buffer.from(b64, 'base64'));
console.log('wrote', OUT, (fs.statSync(OUT).size / 1e6).toFixed(2), 'MB');
