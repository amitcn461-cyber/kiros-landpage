/* global React, useSprite, Easing, clamp, HEB, MONO */
// KIROS Reel — dashboard surfaces, captions, brand mark for scenes 4-6

// ── Full-bleed backdrop: near-black + dot-grid + violet/colored halo ──
function Backdrop({ halo = 'rgba(124,92,255,0.22)', haloY = '38%', base = '#06050A', dotOpacity = 0.5 }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: base, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: dotOpacity, backgroundImage: 'radial-gradient(rgba(124,92,255,0.16) 1.4px, transparent 1.4px)', backgroundSize: '34px 34px' }} />
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(62% 46% at 50% ${haloY}, ${halo} 0%, transparent 70%)`, transition: 'background .4s' }} />
    </div>
  );
}

// HUD corner brackets framing a zone
function HudBrackets({ x, y, w, h, color = 'rgba(124,92,255,0.5)', len = 46, opacity = 1 }) {
  const c = { position: 'absolute', width: len, height: len, borderColor: color, opacity };
  return (
    <React.Fragment>
      <div style={{ ...c, left: x, top: y, borderLeft: `2.5px solid ${color}`, borderTop: `2.5px solid ${color}` }} />
      <div style={{ ...c, left: x + w - len, top: y, borderRight: `2.5px solid ${color}`, borderTop: `2.5px solid ${color}` }} />
      <div style={{ ...c, left: x, top: y + h - len, borderLeft: `2.5px solid ${color}`, borderBottom: `2.5px solid ${color}` }} />
      <div style={{ ...c, left: x + w - len, top: y + h - len, borderRight: `2.5px solid ${color}`, borderBottom: `2.5px solid ${color}` }} />
    </React.Fragment>
  );
}

// ── Overlay caption (eyebrow + big Hebrew). Must live inside a <Sprite>. ──
function Caption({ eyebrow, text, sub, x = 540, y, align = 'center', size = 70, color = '#F4F2FF', accent = '#9B7CFF', hold = true }) {
  const { localTime, duration } = useSprite();
  const entry = 0.5, exitDur = 0.4;
  const exitStart = duration - exitDur;
  let op = 1, ty = 0;
  if (localTime < entry) { const t = Easing.easeOutCubic(clamp(localTime / entry, 0, 1)); op = t; ty = (1 - t) * 26; }
  else if (hold && localTime > exitStart) { const t = Easing.easeInCubic(clamp((localTime - exitStart) / exitDur, 0, 1)); op = 1 - t; ty = -t * 14; }
  const tx = align === 'center' ? '-50%' : align === 'right' ? '-100%' : '0';
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translate(${tx}, ${ty}px)`, opacity: op, textAlign: align, width: align === 'center' ? 920 : 'auto', marginLeft: align === 'center' ? -460 : 0 }}>
      {eyebrow && <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: '0.28em', textTransform: 'uppercase', color: accent, marginBottom: 16 }}>{eyebrow}</div>}
      <div dir="rtl" style={{ fontFamily: HEB, fontWeight: 800, fontSize: size, lineHeight: 1.12, color, letterSpacing: '-0.01em', textShadow: '0 6px 40px rgba(0,0,0,0.5)' }}>{text}</div>
      {sub && <div dir="rtl" style={{ fontFamily: HEB, fontWeight: 500, fontSize: 30, lineHeight: 1.4, color: 'var(--fg-2,#B6B0D8)', marginTop: 18 }}>{sub}</div>}
    </div>
  );
}

// ── KIROS dashboard panel (window chrome) ──
function DashPanel({ x, y, w, h, title = 'KIROS', children, glow = 0 }) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width: w, height: h,
      background: '#0B0916', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 28,
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
      boxShadow: `0 40px 120px rgba(0,0,0,0.6), 0 0 ${60 * glow}px rgba(124,92,255,${0.4 * glow})`,
    }}>
      {/* topbar */}
      <div style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 12, padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#06050A' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {['#FF5C5C', '#FFB23E', '#3FD68C'].map(c => <span key={c} style={{ width: 13, height: 13, borderRadius: '50%', background: c, opacity: 0.85 }} />)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginInlineStart: 6 }}>
          <KMark size={26} />
          <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 20, letterSpacing: '0.16em', color: '#F4F2FF' }}>{title}</span>
        </div>
        <div style={{ marginLeft: 'auto' }}><LiveBadge /></div>
      </div>
      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>{children}</div>
    </div>
  );
}

function LiveBadge({ label = 'AI מגיב בזמן אמת' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 15px', borderRadius: 999, background: 'rgba(63,214,140,0.14)', border: '1px solid rgba(63,214,140,0.4)' }}>
      <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#3FD68C', boxShadow: '0 0 12px #3FD68C', animation: 'kpulse 1.1s infinite' }} />
      <span dir="rtl" style={{ fontFamily: HEB, fontWeight: 600, fontSize: 17, color: '#3FD68C', whiteSpace: 'nowrap' }}>{label}</span>
    </div>
  );
}

// Dark KIROS chat bubble
function KBubble({ side = 'lead', children, who, style }) {
  const ai = side === 'ai';
  return (
    <div style={{ alignSelf: ai ? 'flex-start' : 'flex-end', maxWidth: '80%', ...style }}>
      {who && <div style={{ fontFamily: MONO, fontSize: 14, letterSpacing: '0.16em', textTransform: 'uppercase', color: ai ? '#C4B6FD' : '#7C769C', marginBottom: 7, textAlign: ai ? 'left' : 'right' }}>{who}</div>}
      <div dir="rtl" style={{ padding: '14px 19px', fontSize: 23, lineHeight: 1.4, fontWeight: 500, borderRadius: 22, fontFamily: HEB,
        background: ai ? 'linear-gradient(135deg,#9B7CFF,#7C5CFF)' : '#1A1736', color: ai ? '#fff' : '#F4F2FF',
        borderBottomLeftRadius: ai ? 7 : 22, borderBottomRightRadius: ai ? 22 : 7,
        boxShadow: ai ? '0 0 28px rgba(124,92,255,0.4)' : 'none' }}>{children}</div>
    </div>
  );
}

// Temperature tag pill
const TEMP = {
  hot: { c: '#FF4D8D', bg: 'rgba(255,77,141,0.16)', label: 'חם' },
  warm: { c: '#FFB23E', bg: 'rgba(255,178,62,0.16)', label: 'חמים' },
  cold: { c: '#4AA8FF', bg: 'rgba(74,168,255,0.16)', label: 'קר' },
  none: { c: '#7C769C', bg: 'rgba(124,118,156,0.14)', label: 'לא רלוונטי' },
};
function Tag({ temp = 'hot', scale = 1 }) {
  const t = TEMP[temp];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 15px', borderRadius: 999, background: t.bg, border: `1px solid ${t.c}55`, transform: `scale(${scale})`, animation: 'kpop 0.34s cubic-bezier(0.2,0.8,0.2,1)' }}>
      <span style={{ width: 9, height: 9, borderRadius: '50%', background: t.c, boxShadow: `0 0 10px ${t.c}` }} />
      <span dir="rtl" style={{ fontFamily: HEB, fontWeight: 700, fontSize: 19, color: t.c }}>{t.label}</span>
    </span>
  );
}

// Lead row in the inbox list
function LeadRow({ initials, name, channel = 'ig', snippet, temp, showTag = true, highlight = false }) {
  const t = TEMP[temp];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)',
      borderRight: `3px solid ${highlight ? t.c : 'transparent'}`, background: highlight ? 'rgba(124,92,255,0.06)' : 'transparent' }}>
      <div style={{ position: 'relative', flex: 'none' }}>
        <div style={{ width: 58, height: 58, borderRadius: '50%', background: 'linear-gradient(135deg,#9B7CFF,#5B3EE0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HEB, fontWeight: 700, color: '#fff', fontSize: 24 }}>{initials}</div>
        <span style={{ position: 'absolute', bottom: -2, right: -2, width: 24, height: 24, borderRadius: '50%', background: '#0B0916', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {channel === 'wa'
            ? <svg width="15" height="15" viewBox="0 0 24 24" fill="#25D366"><path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.3A10 10 0 1 0 12 2z"/></svg>
            : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#E1306C" strokeWidth="2.4"><rect x="2" y="2" width="20" height="20" rx="5.5"/><circle cx="12" cy="12" r="4.2"/></svg>}
        </span>
      </div>
      <div style={{ flex: 1, minWidth: 0, textAlign: 'right' }}>
        <div dir="rtl" style={{ fontFamily: HEB, fontWeight: 700, fontSize: 24, color: '#F4F2FF' }}>{name}</div>
        <div dir="rtl" style={{ fontFamily: HEB, fontWeight: 400, fontSize: 19, color: '#7C769C', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{snippet}</div>
      </div>
      <div style={{ flex: 'none', minWidth: 110, display: 'flex', justifyContent: 'flex-end' }}>{showTag && <Tag temp={temp} />}</div>
    </div>
  );
}

// AI summary card (scene 5)
function SummaryRow({ icon, label, value, valueColor = '#F4F2FF', shown = true }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, padding: '16px 20px', background: '#121026', borderRadius: 14, opacity: shown ? 1 : 0, transform: shown ? 'none' : 'translateY(10px)', transition: 'opacity .35s, transform .35s' }}>
      <span dir="rtl" style={{ fontFamily: HEB, fontWeight: 700, fontSize: 23, color: valueColor, textAlign: 'left' }}>{value}</span>
      <span dir="rtl" style={{ fontFamily: MONO, fontSize: 16, letterSpacing: '0.06em', color: '#7C769C', display: 'flex', alignItems: 'center', gap: 8 }}>{label}{icon}</span>
    </div>
  );
}

// ── Glowing K mark (brand) ──
function KMark({ size = 80, glow = 0.5 }) {
  return <img src={(window.__resources && window.__resources.kmark) || "reel/kiros-mark.png"} alt="KIROS" style={{ width: size, height: size, objectFit: 'contain', filter: `drop-shadow(0 0 ${size * 0.28 * glow}px rgba(124,92,255,${0.7 * glow}))` }} />;
}

Object.assign(window, { Backdrop, HudBrackets, Caption, DashPanel, LiveBadge, KBubble, Tag, TEMP, LeadRow, SummaryRow, KMark });
