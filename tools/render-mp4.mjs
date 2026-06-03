// Renders "KIROS Reel.html" to an MP4 by seeking the timeline frame-by-frame
// in headless Chrome and encoding the PNG frames with ffmpeg.
//
//   node tools/render-mp4.mjs            # full 35s @ 30fps
//   node tools/render-mp4.mjs --smoke    # render 4 probe frames only (pipeline test)
//
// Video-only: the reel's synthesized Web Audio SFX are not captured here.

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import puppeteer from 'puppeteer-core';
import ffmpegPath from 'ffmpeg-static';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const CHROME =
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const W = 1080, H = 1920;
const FPS = 30;
const DURATION = 35.0;
const HTML = 'KIROS Reel.html';

const SMOKE = process.argv.includes('--smoke');
const FRAMES_DIR = path.join(__dirname, 'frames');
const OUT = path.join(ROOT, 'KIROS Reel.mp4');

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
  '.jsx': 'application/javascript', '.png': 'image/png', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.woff2': 'font/woff2',
};

// ── tiny static file server rooted at the project dir ───────────────────────
function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let p = decodeURIComponent(req.url.split('?')[0]);
      if (p === '/') p = '/' + HTML;
      const file = path.join(ROOT, p);
      if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
        res.writeHead(404); res.end('not found'); return;
      }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
      fs.createReadStream(file).pipe(res);
    });
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  if (fs.existsSync(FRAMES_DIR)) fs.rmSync(FRAMES_DIR, { recursive: true, force: true });
  fs.mkdirSync(FRAMES_DIR, { recursive: true });

  const server = await startServer();
  const port = server.address().port;
  const url = `http://127.0.0.1:${port}/${encodeURIComponent(HTML)}`;
  console.log('serving', url);

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: [`--window-size=${W},${H + 120}`, '--hide-scrollbars', '--force-color-profile=srgb'],
    defaultViewport: { width: W, height: H, deviceScaleFactor: 1 },
  });
  const page = await browser.newPage();
  page.on('pageerror', (e) => console.error('PAGE ERROR:', e.message));
  page.on('console', (m) => { if (m.type() === 'error') console.error('console.error:', m.text()); });

  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

  // wait for Babel to compile + the seek bridge to be installed
  await page.waitForFunction('typeof window.__seek === "function"', { timeout: 60000 });
  // wait for webfonts (Hebrew Heebo etc.) so text isn't captured in a fallback face
  await page.evaluate(() => document.fonts.ready);
  await sleep(400);

  // Pin the canvas to the top-left at native 1080x1920 and hide playback chrome,
  // so a fixed clip captures the exact frame at full resolution.
  await page.addStyleTag({
    content: `
      html, body { background:#000 !important; }
      #root > div { background:#000 !important; }
      #root > div > div:last-child { display:none !important; }          /* playback bar */
      #root > div > div:first-child { align-items:flex-start !important; justify-content:flex-start !important; overflow:visible !important; }
      #root > div > div:first-child > div { transform:none !important; box-shadow:none !important; }
    `,
  });

  const clip = { x: 0, y: 0, width: W, height: H };
  const times = SMOKE
    ? [0.5, 6, 13, 32]
    : Array.from({ length: Math.round(DURATION * FPS) }, (_, i) => i / FPS);

  console.log(`rendering ${times.length} frames @ ${FPS}fps`);
  const t0 = Date.now();
  for (let i = 0; i < times.length; i++) {
    const t = times[i];
    // freeze CSS loop-animations to a deterministic phase for time t, kill transitions
    await page.evaluate((tt) => {
      let s = document.getElementById('__freeze');
      if (!s) { s = document.createElement('style'); s.id = '__freeze'; document.head.appendChild(s); }
      s.textContent = `*{animation-delay:-${tt}s !important;animation-play-state:paused !important;transition:none !important;}`;
      window.__seek(tt);
    }, t);
    // two rAFs to guarantee React commit + paint
    await page.evaluate(() => new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res))));
    const name = SMOKE ? `smoke-${i}.png` : `frame-${String(i).padStart(5, '0')}.png`;
    await page.screenshot({ path: path.join(FRAMES_DIR, name), clip });
    if (!SMOKE && i % 60 === 0) {
      const pct = ((i / times.length) * 100).toFixed(0);
      const eta = i ? ((Date.now() - t0) / i * (times.length - i) / 1000).toFixed(0) : '?';
      console.log(`  ${pct}%  frame ${i}/${times.length}  eta ${eta}s`);
    }
  }
  console.log(`frames done in ${((Date.now() - t0) / 1000).toFixed(0)}s`);

  await browser.close();
  server.close();

  if (SMOKE) { console.log('smoke frames in', FRAMES_DIR); return; }

  // ── encode ────────────────────────────────────────────────────────────────
  console.log('encoding', OUT);
  await new Promise((resolve, reject) => {
    const args = [
      '-y', '-framerate', String(FPS),
      '-i', path.join(FRAMES_DIR, 'frame-%05d.png'),
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18',
      '-preset', 'medium', '-movflags', '+faststart', OUT,
    ];
    const ff = spawn(ffmpegPath, args, { stdio: ['ignore', 'inherit', 'inherit'] });
    ff.on('close', (c) => (c === 0 ? resolve() : reject(new Error('ffmpeg exit ' + c))));
  });
  fs.rmSync(FRAMES_DIR, { recursive: true, force: true });
  const mb = (fs.statSync(OUT).size / 1e6).toFixed(1);
  console.log(`DONE -> ${OUT} (${mb} MB)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
