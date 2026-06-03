/* global React */
// KIROS Reel — phone frame + realistic IG/WhatsApp chat UI
// All text helpers default to RTL Hebrew.

const HEB = "'Heebo', sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

// RTL Hebrew text node
function H({ children, style, as = 'div', dir = 'rtl' }) {
  const Tag = as;
  return <Tag dir={dir} style={{ fontFamily: HEB, ...style }}>{children}</Tag>;
}

// ── Phone frame ──────────────────────────────────────────────
function PhoneFrame({ width = 600, height = 1240, x, y, children, glow = 'rgba(124,92,255,0.0)', screenBg = '#ffffff' }) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width, height,
      borderRadius: 64, background: '#0c0a16',
      padding: 13,
      boxShadow: `0 40px 120px rgba(0,0,0,0.6), 0 0 0 2px rgba(255,255,255,0.06), 0 0 90px ${glow}`,
    }}>
      {/* screen */}
      <div style={{
        position: 'relative', width: '100%', height: '100%',
        borderRadius: 52, overflow: 'hidden', background: screenBg,
        display: 'flex', flexDirection: 'column',
      }}>
        {/* dynamic island */}
        <div style={{
          position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
          width: 124, height: 34, borderRadius: 20, background: '#0c0a16', zIndex: 40,
        }} />
        {children}
      </div>
    </div>
  );
}

// iOS-ish status bar (light or dark text)
function StatusBar({ dark = false, time = '9:41' }) {
  const c = dark ? '#0c0a16' : '#fff';
  return (
    <div style={{
      height: 64, flex: 'none', display: 'flex', alignItems: 'flex-end',
      justifyContent: 'space-between', padding: '0 34px 6px', fontFamily: HEB,
    }}>
      <span style={{ fontSize: 19, fontWeight: 700, color: c }}>{time}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <svg width="20" height="14" viewBox="0 0 20 14" fill={c}><rect x="0" y="9" width="3" height="5" rx="1"/><rect x="5" y="6" width="3" height="8" rx="1"/><rect x="10" y="3" width="3" height="11" rx="1"/><rect x="15" y="0" width="3" height="14" rx="1"/></svg>
        <svg width="18" height="14" viewBox="0 0 18 14" fill={c}><path d="M9 3c2.5 0 4.8 1 6.5 2.6l1.3-1.4C14.7 2.1 12 1 9 1S3.3 2.1 1.2 4.2L2.5 5.6C4.2 4 6.5 3 9 3z"/><path d="M9 7c1.4 0 2.7.6 3.6 1.5l1.4-1.4C12.7 5.8 10.9 5 9 5s-3.7.8-5 2.1l1.4 1.4C6.3 7.6 7.6 7 9 7z"/><circle cx="9" cy="11" r="2"/></svg>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <div style={{ width: 25, height: 13, border: `1.6px solid ${c}`, borderRadius: 4, opacity: 0.9, position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 1.6, width: '72%', background: c, borderRadius: 1 }} />
          </div>
          <div style={{ width: 2, height: 5, background: c, borderRadius: 1, opacity: 0.6 }} />
        </div>
      </div>
    </div>
  );
}

// ── Instagram DM header ──────────────────────────────────────
function IGHeader({ name, sub = 'פעיל/ה לאחרונה היום' }) {
  return (
    <div style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px 14px', borderBottom: '1px solid #efefef', background: '#fff' }}>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
      <div style={{ width: 52, height: 52, borderRadius: '50%', padding: 2.5, background: 'linear-gradient(45deg,#F58529,#DD2A7B,#8134AF)' }}>
        <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#dcd6ea', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HEB, fontWeight: 700, color: '#6a6385', fontSize: 22 }}>ד</div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: HEB, fontWeight: 700, fontSize: 23, color: '#0c0a16' }} dir="rtl">{name}</div>
        <div style={{ fontFamily: HEB, fontWeight: 400, fontSize: 16, color: '#8e8e8e' }} dir="rtl">{sub}</div>
      </div>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
    </div>
  );
}

// ── WhatsApp header (competitor) ─────────────────────────────
function WAHeader({ name, sub = 'מקליד...' }) {
  return (
    <div style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 13, padding: '10px 20px 13px', background: '#075E54' }}>
      <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
      <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HEB, fontWeight: 700, color: '#fff', fontSize: 21 }}>מ</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: HEB, fontWeight: 700, fontSize: 22, color: '#fff' }} dir="rtl">{name}</div>
        <div style={{ fontFamily: HEB, fontWeight: 400, fontSize: 15, color: '#c8f0e0' }} dir="rtl">{sub}</div>
      </div>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
    </div>
  );
}

// ── Chat bubble ──────────────────────────────────────────────
// side: 'in' (left, customer) | 'out' (right, owner/competitor)
// channel: 'ig' | 'wa'
function Bubble({ side = 'in', channel = 'ig', children, time, status, faded = false, style }) {
  const out = side === 'out';
  let bg, color;
  if (channel === 'wa') {
    bg = out ? '#DCF8C6' : '#fff';
    color = '#0c1f17';
  } else {
    bg = out ? 'linear-gradient(135deg,#9B7CFF,#7C5CFF)' : '#efeff0';
    color = out ? '#fff' : '#0c0a16';
  }
  return (
    <div style={{ display: 'flex', justifyContent: out ? 'flex-start' : 'flex-end', opacity: faded ? 0.45 : 1, transition: 'opacity .3s', ...style }}>
      <div dir="rtl" style={{
        maxWidth: '76%', padding: '13px 17px', borderRadius: 24, background: bg, color,
        fontFamily: HEB, fontSize: 22, lineHeight: 1.4, fontWeight: 500,
        borderBottomRightRadius: out ? 24 : 7, borderBottomLeftRadius: out ? 7 : 24,
        boxShadow: channel === 'wa' ? '0 1px 1px rgba(0,0,0,0.12)' : 'none',
        position: 'relative',
      }}>
        {children}
        {(time || status) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'flex-start', marginTop: 5 }}>
            <span style={{ fontSize: 13, fontFamily: HEB, color: out ? (channel === 'wa' ? '#7da890' : 'rgba(255,255,255,0.8)') : '#9a9aa2' }}>{time}</span>
            {status === 'read' && <ReadTicks color={channel === 'wa' ? '#34B7F1' : 'rgba(255,255,255,0.85)'} />}
            {status === 'sent' && <ReadTicks color={out ? (channel === 'wa' ? '#9bbfae' : 'rgba(255,255,255,0.6)') : '#b8b8bf'} single />}
          </div>
        )}
      </div>
    </div>
  );
}

function ReadTicks({ color = '#34B7F1', single = false }) {
  return (
    <svg width={single ? 13 : 18} height="11" viewBox={single ? '0 0 13 11' : '0 0 18 11'} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 6l3 3 6-7" />
      {!single && <path d="M7 9l1 0.8 6-7" transform="translate(2,0)" />}
    </svg>
  );
}

// Typing indicator (three pulsing dots)
function TypingBubble({ channel = 'ig' }) {
  const bg = channel === 'wa' ? '#fff' : '#efeff0';
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <div style={{ padding: '15px 19px', borderRadius: 24, borderBottomLeftRadius: 7, background: bg, display: 'flex', gap: 7, boxShadow: channel === 'wa' ? '0 1px 1px rgba(0,0,0,0.12)' : 'none' }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{ width: 11, height: 11, borderRadius: '50%', background: '#b0b0b8', animation: `kt 1.2s ${i * 0.18}s infinite ease-in-out` }} />
        ))}
      </div>
    </div>
  );
}

// Compose bar (empty / unattended)
function ComposeBar({ channel = 'ig', placeholder = 'הודעה...' }) {
  const wa = channel === 'wa';
  return (
    <div style={{ flex: 'none', padding: '14px 20px 30px', background: wa ? '#ECE5DD' : '#fff', borderTop: wa ? 'none' : '1px solid #efefef', display: 'flex', alignItems: 'center', gap: 12 }}>
      <div dir="rtl" style={{ flex: 1, background: wa ? '#fff' : '#f1f1f4', borderRadius: 26, padding: '15px 20px', fontFamily: HEB, fontSize: 20, color: '#9a9aa2' }}>{placeholder}</div>
      <div style={{ width: 50, height: 50, borderRadius: '50%', background: wa ? '#25D366' : 'linear-gradient(135deg,#9B7CFF,#7C5CFF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
      </div>
    </div>
  );
}

// IG-style top notification banner (slides from top of screen)
function NotifBanner({ title, body, ty = 0, opacity = 1 }) {
  return (
    <div style={{
      position: 'absolute', top: 64, left: 16, right: 16, zIndex: 50,
      transform: `translateY(${ty}px)`, opacity,
      background: 'rgba(255,255,255,0.86)', backdropFilter: 'blur(20px)',
      borderRadius: 26, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 13,
      boxShadow: '0 18px 50px rgba(0,0,0,0.22)',
    }}>
      <div style={{ width: 46, height: 46, borderRadius: 12, background: 'linear-gradient(45deg,#F58529,#DD2A7B,#8134AF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5.5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.6" cy="6.4" r="1.3" fill="#fff" stroke="none"/></svg>
      </div>
      <div style={{ flex: 1, textAlign: 'right' }}>
        <div dir="rtl" style={{ fontFamily: HEB, fontWeight: 700, fontSize: 18, color: '#0c0a16' }}>{title}</div>
        <div dir="rtl" style={{ fontFamily: HEB, fontWeight: 400, fontSize: 17, color: '#3a3a42' }}>{body}</div>
      </div>
    </div>
  );
}

// Counting timer chip (urgency)
function TimerChip({ seconds, y = 180, danger = false }) {
  const m = Math.floor(seconds / 60), s = Math.floor(seconds % 60);
  const label = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return (
    <div style={{
      position: 'absolute', left: '50%', top: y, transform: 'translateX(-50%)', zIndex: 60, whiteSpace: 'nowrap',
      display: 'flex', alignItems: 'center', gap: 9, padding: '11px 18px', borderRadius: 999,
      background: danger ? 'rgba(255,92,92,0.16)' : 'rgba(12,10,22,0.72)', backdropFilter: 'blur(10px)',
      border: `1.5px solid ${danger ? 'rgba(255,92,92,0.55)' : 'rgba(255,255,255,0.16)'}`,
    }}>
      <span style={{ width: 11, height: 11, borderRadius: '50%', background: danger ? '#FF5C5C' : '#FFB23E', boxShadow: `0 0 12px ${danger ? '#FF5C5C' : '#FFB23E'}`, animation: 'kpulse 1s infinite' }} />
      <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: 26, color: danger ? '#FF8585' : '#fff', fontVariantNumeric: 'tabular-nums' }}>{label}</span>
      <span dir="rtl" style={{ fontFamily: HEB, fontSize: 17, color: danger ? '#FF8585' : 'rgba(255,255,255,0.7)', fontWeight: 600 }}>ללא מענה</span>
    </div>
  );
}

Object.assign(window, { H, HEB, MONO, PhoneFrame, StatusBar, IGHeader, WAHeader, Bubble, ReadTicks, TypingBubble, ComposeBar, NotifBanner, TimerChip });
