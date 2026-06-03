/* global React, useSprite, useTime, Easing, interpolate, animate, clamp,
   HEB, MONO, PhoneFrame, StatusBar, IGHeader, WAHeader, Bubble, TypingBubble,
   ComposeBar, NotifBanner, TimerChip, Backdrop */
// KIROS Reel — Scenes 1-3 (hook → ignored → lost) + time backdrop

// Phone geometry (shared across loss scenes for continuity)
const PX = 240, PY = 392, PW = 600, PH = 1248;
const PCX = PX + PW / 2, PCY = PY + PH / 2;

function ZoomLayer({ scale = 1, ox = PCX, oy = PCY, children }) {
  return <div style={{ position: 'absolute', inset: 0, transform: `scale(${scale})`, transformOrigin: `${ox}px ${oy}px`, willChange: 'transform' }}>{children}</div>;
}

function Appear({ at, lt, dur = 0.42, from = 26, scaleFrom = 1, children }) {
  if (lt < at) return null;
  const p = clamp((lt - at) / dur, 0, 1);
  const e = Easing.easeOutBack(p);
  const op = clamp((lt - at) / 0.24, 0, 1);
  const s = scaleFrom + (1 - scaleFrom) * e;
  return <div style={{ opacity: op, transform: `translateY(${(1 - e) * from}px) scale(${s})`, willChange: 'transform, opacity' }}>{children}</div>;
}

// ── Time-driven full-bleed backdrop (tints with the emotional arc) ──
function TimeBackdrop() {
  const t = useTime();
  let halo = 'rgba(124,92,255,0.24)';
  if (t >= 4.2 && t < 10.5) halo = 'rgba(255,178,62,0.17)';
  else if (t >= 10.5 && t < 17.2) halo = 'rgba(255,77,141,0.22)';
  else if (t >= 17.2) halo = 'rgba(124,92,255,0.26)';
  return (
    <React.Fragment>
      <Backdrop halo={halo} haloY={t < 4.2 ? '42%' : t < 17.2 ? '36%' : '40%'} />
      {/* soft vignette */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(120% 80% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)' }} />
    </React.Fragment>
  );
}

// ───────────────────────── SCENE 1 — HOOK ─────────────────────────
function SceneHook() {
  const { localTime: lt } = useSprite();
  const dim = lt < 1.9 ? 0.8 : clamp(0.8 - (lt - 1.9) / 0.4 * 0.8, 0, 0.8);
  const hOp = lt < 1.9 ? clamp(lt / 0.55, 0, 1) : clamp(1 - (lt - 1.9) / 0.35, 0, 1);
  const hScale = interpolate([0, 0.7, 1.9], [0.9, 1, 1.04], Easing.easeOutCubic)(lt);
  const notifT = clamp((lt - 2.05) / 0.5, 0, 1);
  const notifTy = (1 - Easing.easeOutBack(notifT)) * -150;
  const notifOp = lt > 3.5 ? clamp(1 - (lt - 3.5) / 0.4, 0, 1) : clamp((lt - 2.05) / 0.3, 0, 1);
  const zoom = interpolate([2.2, 4.2], [1, 1.07], Easing.easeInOutCubic)(lt);
  const phoneRise = interpolate([0, 1], [60, 0], Easing.easeOutCubic)(lt);

  return (
    <React.Fragment>
      <ZoomLayer scale={zoom}>
        <div style={{ transform: `translateY(${phoneRise}px)` }}>
          <PhoneFrame x={PX} y={PY} w={PW} h={PH} width={PW} height={PH} glow="rgba(124,92,255,0.25)">
            <StatusBar dark time="21:14" />
            <IGHeader name="דנה לוי" sub="פעיל/ה עכשיו" />
            <div style={{ flex: 1, padding: '24px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 14 }}>
              <div style={{ alignSelf: 'center', fontFamily: HEB, fontSize: 16, color: '#b8b8c0', background: '#f1f1f4', padding: '6px 16px', borderRadius: 999, marginBottom: 6 }}>היום</div>
              <Appear at={2.35} lt={lt} from={18}>
                <Bubble side="in" channel="ig" time="21:14">היי, כמה עולה השירות?</Bubble>
              </Appear>
            </div>
            <ComposeBar channel="ig" placeholder="הודעה..." />
            <NotifBanner title="דנה לוי" body="היי, כמה עולה השירות?" ty={notifTy} opacity={notifOp} />
          </PhoneFrame>
        </div>
      </ZoomLayer>

      {/* scrim + headline */}
      <div style={{ position: 'absolute', inset: 0, background: '#06050A', opacity: dim, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', left: 540, top: 720, transform: `translate(-50%,-50%) scale(${hScale})`, opacity: hOp, width: 960, textAlign: 'center' }}>
        <div style={{ fontFamily: MONO, fontSize: 24, letterSpacing: '0.3em', color: '#9B7CFF', marginBottom: 26 }}>KIROS</div>
        <div dir="rtl" style={{ fontFamily: HEB, fontWeight: 800, fontSize: 92, lineHeight: 1.1, color: '#F4F2FF', letterSpacing: '-0.015em' }}>
          רוצה לראות איך הפסדת לקוח <span style={{ color: '#FF4D8D' }}>ב-10 שניות?</span>
        </div>
      </div>
    </React.Fragment>
  );
}

// ──────────────────────── SCENE 2 — IGNORED ───────────────────────
function SceneIgnored() {
  const { localTime: lt } = useSprite();
  // timer counts up fast: 0:08 → ~3:20 accelerated
  const secs = interpolate([0, 6.3], [8, 214], Easing.easeInQuad)(lt);
  const zoom = interpolate([0, 6.3], [1.02, 1.12], Easing.easeInOutSine)(lt);
  // thread scrolls up as bubbles stack
  const scroll = interpolate([1.2, 2.0, 3.6, 4.4], [0, -30, -30, -78], Easing.easeInOutCubic)(lt);
  const shakeOn = lt > 4.6;

  return (
    <React.Fragment>
      <ZoomLayer scale={zoom}>
        <PhoneFrame x={PX} y={PY} w={PW} h={PH} width={PW} height={PH} glow="rgba(255,178,62,0.18)">
          <StatusBar dark time="21:16" />
          <IGHeader name="דנה לוי" sub="פעיל/ה לפני דקה" />
          <div style={{ flex: 1, padding: '20px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 13, overflow: 'hidden' }}>
            <div style={{ transform: `translateY(${scroll}px)`, display: 'flex', flexDirection: 'column', gap: 13, transition: 'transform .2s' }}>
              <Bubble side="in" channel="ig" time="21:14">היי, כמה עולה השירות?</Bubble>
              <Appear at={1.2} lt={lt} from={20}><Bubble side="in" channel="ig" time="21:15">יש מישהו? 🙏</Bubble></Appear>
              <Appear at={3.4} lt={lt} from={20}>
                <div style={{ animation: shakeOn ? 'kshake 0.5s 1' : 'none' }}>
                  <Bubble side="in" channel="ig" time="21:16">אני צריכה תשובה דחוף</Bubble>
                </div>
              </Appear>
            </div>
          </div>
          <ComposeBar channel="ig" placeholder="הקלד תשובה..." />
          <TimerChip seconds={secs} x={PX + PW / 2 - 130} y={PY + 120} danger={lt > 3.2} />
        </PhoneFrame>
      </ZoomLayer>

      {/* bottom caption */}
      <div style={{ position: 'absolute', left: 540, top: 1748, transform: 'translateX(-50%)', opacity: clamp((lt - 0.6) / 0.5, 0, 1) * (lt > 6.0 ? clamp(1 - (lt - 6.0) / 0.3, 0, 1) : 1), textAlign: 'center', width: 900 }}>
        <div dir="rtl" style={{ fontFamily: HEB, fontWeight: 700, fontSize: 40, color: '#FFB23E' }}>כל דקה של שתיקה מקררת את הלקוח</div>
      </div>
    </React.Fragment>
  );
}

// ───────────────────────── SCENE 3 — LOST ─────────────────────────
function SceneLost() {
  const { localTime: lt } = useSprite();
  // IG msgs become "read" (faded) ~0.4-2.0; phone screen slides to competitor at ~2.2
  const faded = lt > 0.9;
  const slide = interpolate([2.0, 2.7], [0, -50], Easing.easeInOutCubic)(lt); // % of container (2 screens) -> reveals competitor
  const zoom = interpolate([0, 6.7], [1.04, 1.12], Easing.easeInOutSine)(lt);
  // competitor beats (relative to slide ~2.7)
  const capOp = lt < 4.3 ? clamp((lt - 4.3) / 0.5, 0, 1) : (lt > 6.3 ? clamp(1 - (lt - 6.3) / 0.4, 0, 1) : 1);
  const capScale = interpolate([4.3, 4.9], [0.86, 1], Easing.easeOutBack)(lt);

  return (
    <React.Fragment>
      <ZoomLayer scale={zoom}>
        <PhoneFrame x={PX} y={PY} w={PW} h={PH} width={PW} height={PH} glow={lt > 2.5 ? 'rgba(37,211,102,0.18)' : 'rgba(255,77,141,0.18)'}>
          {/* sliding screens container */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', width: '200%', transform: `translateX(${slide}%)` }}>
            {/* IG screen — read / abandoned */}
            <div style={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
              <StatusBar dark time="21:18" />
              <IGHeader name="דנה לוי" sub="פעיל/ה לפני 3 דק׳" />
              <div style={{ flex: 1, padding: '20px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 13 }}>
                <Bubble side="in" channel="ig" faded={faded}>היי, כמה עולה השירות?</Bubble>
                <Bubble side="in" channel="ig" faded={faded}>יש מישהו? 🙏</Bubble>
                <Bubble side="in" channel="ig" faded={faded}>אני צריכה תשובה דחוף</Bubble>
                <div style={{ alignSelf: 'flex-start', opacity: faded ? 1 : 0, transition: 'opacity .4s', display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <span dir="rtl" style={{ fontFamily: HEB, fontSize: 17, color: '#9a9aa2' }}>נקרא 21:15 · ללא מענה</span>
                </div>
              </div>
              <ComposeBar channel="ig" placeholder="הודעה..." />
            </div>
            {/* WhatsApp competitor screen — instant reply */}
            <div style={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column', background: '#ECE5DD' }}>
              <StatusBar dark time="21:18" />
              <WAHeader name="העסק המתחרה" sub="מקליד..." />
              <div style={{ flex: 1, padding: '22px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 13 }}>
                <Appear at={3.0} lt={lt} from={16}><Bubble side="out" channel="wa" time="21:18" status="read">היי, פנוי עכשיו לתת הצעה?</Bubble></Appear>
                {lt > 3.5 && lt < 4.1 && <TypingBubble channel="wa" />}
                <Appear at={4.1} lt={lt} from={16}><Bubble side="in" channel="wa" time="21:18">היי! בטח 🙌 שולח לך הצעה עכשיו</Bubble></Appear>
                <Appear at={4.7} lt={lt} from={12}>
                  <div style={{ alignSelf: 'center', display: 'flex', alignItems: 'center', gap: 9, padding: '8px 16px', borderRadius: 999, background: 'rgba(37,211,102,0.16)', border: '1px solid rgba(37,211,102,0.5)' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1ea34f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                    <span dir="rtl" style={{ fontFamily: HEB, fontWeight: 700, fontSize: 18, color: '#178a43' }}>נענה תוך 8 שניות</span>
                  </div>
                </Appear>
              </div>
              <ComposeBar channel="wa" placeholder="הודעה" />
            </div>
          </div>
        </PhoneFrame>
      </ZoomLayer>

      {/* big red caption */}
      <div style={{ position: 'absolute', left: 540, top: 1690, transform: `translateX(-50%) scale(${capScale})`, opacity: capOp, textAlign: 'center', width: 940 }}>
        <div dir="rtl" style={{ fontFamily: HEB, fontWeight: 800, fontSize: 78, color: '#FF4D8D', textShadow: '0 0 40px rgba(255,77,141,0.4)' }}>הלקוח עבר למתחרה</div>
      </div>
    </React.Fragment>
  );
}

Object.assign(window, { PX, PY, PW, PH, PCX, PCY, ZoomLayer, Appear, TimeBackdrop, SceneHook, SceneIgnored, SceneLost });
