/* global React, useSprite, Easing, interpolate, animate, clamp, HEB, MONO,
   DashPanel, LiveBadge, KBubble, Tag, LeadRow, SummaryRow, KMark, TypingBubble, Appear */
// KIROS Reel — Scenes 4-6 (solution → summary → ending)

const PANEL = { x: 110, y: 352, w: 860, h: 1296 };

function capOpacity(lt, inAt, outAt, dur = 0.45) {
  let op = clamp((lt - inAt) / dur, 0, 1);
  if (outAt != null && lt > outAt) op *= clamp(1 - (lt - outAt) / 0.4, 0, 1);
  return op;
}

// ─────────────────────── SCENE 4 — SOLUTION ───────────────────────
function SceneSolution() {
  const { localTime: lt } = useSprite();
  const enter = Easing.easeOutCubic(clamp(lt / 0.55, 0, 1));
  const panelScale = 0.9 + 0.1 * enter;
  const panelOp = clamp(lt / 0.4, 0, 1);
  const flash = lt < 0.5 ? clamp(1 - lt / 0.5, 0, 1) : 0;

  const convoOp = lt < 3.7 ? 1 : clamp(1 - (lt - 3.7) / 0.4, 0, 1);
  const listOp = lt < 3.8 ? 0 : clamp((lt - 3.8) / 0.45, 0, 1);
  const convoZoom = interpolate([0.5, 3.7], [1, 1.05], Easing.easeInOutSine)(lt);

  return (
    <React.Fragment>
      {/* entrance flash */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(50% 40% at 50% 38%, rgba(124,92,255,0.5), transparent 70%)', opacity: flash, pointerEvents: 'none' }} />

      {/* captions */}
      <div style={{ position: 'absolute', left: 540, top: 150, transform: 'translateX(-50%)', textAlign: 'center', width: 920 }}>
        <div style={{ opacity: capOpacity(lt, 0.35, 3.5), position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: 920 }}>
          <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: '0.28em', color: '#9B7CFF', marginBottom: 14 }}>KIROS · אוטומציה חכמה</div>
          <div dir="rtl" style={{ fontFamily: HEB, fontWeight: 800, fontSize: 66, color: '#F4F2FF', whiteSpace: 'nowrap' }}>כל ליד מטופל בזמן אמת</div>
        </div>
        <div style={{ opacity: capOpacity(lt, 4.0, 8.4), position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: 920 }}>
          <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: '0.28em', color: '#9B7CFF', marginBottom: 14 }}>מיון אוטומטי</div>
          <div dir="rtl" style={{ fontFamily: HEB, fontWeight: 800, fontSize: 66, color: '#F4F2FF', whiteSpace: 'nowrap' }}>בלי לפספס אף פנייה</div>
        </div>
      </div>

      <div style={{ opacity: panelOp, transform: `scale(${panelScale})`, transformOrigin: `${PANEL.x + PANEL.w / 2}px ${PANEL.y + PANEL.h / 2}px` }}>
        <DashPanel {...PANEL} glow={enter}>
          {/* BEAT A — live conversation */}
          <div style={{ position: 'absolute', inset: 0, opacity: convoOp, transform: `scale(${convoZoom})`, transformOrigin: '50% 60%', display: 'flex', flexDirection: 'column', padding: '30px 30px 34px', gap: 20 }}>
            <div dir="rtl" style={{ fontFamily: MONO, fontSize: 16, letterSpacing: '0.14em', color: '#7C769C', textTransform: 'uppercase', alignSelf: 'center' }}>KIROS ניהל את השיחה הזו</div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 18 }}>
              <Appear at={0.5} lt={lt} from={16}><KBubble side="lead" who="ליד · אינסטגרם">היי, כמה עולה השירות?</KBubble></Appear>
              {lt > 1.05 && lt < 1.7 && <div style={{ alignSelf: 'flex-start' }}><TypingBubble channel="ig" /></div>}
              <Appear at={1.7} lt={lt} from={16}><KBubble side="ai" who="KIROS · AI">היי 👋 שמח לעזור! לאיזה תאריך, וכמה אנשים בערך?</KBubble></Appear>
              <Appear at={2.5} lt={lt} from={16}><KBubble side="lead">מחר בערב, בערך 30 איש</KBubble></Appear>
              <Appear at={3.1} lt={lt} from={16}><KBubble side="ai" who="KIROS · AI">מעולה ✅ סימנתי כליד חם והעברתי לצוות — מישהו יחזור אליך עוד מעט</KBubble></Appear>
            </div>
          </div>

          {/* BEAT B — auto-tagged inbox */}
          <div style={{ position: 'absolute', inset: 0, opacity: listOp, pointerEvents: 'none', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '22px 26px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span dir="rtl" style={{ fontFamily: HEB, fontWeight: 800, fontSize: 30, color: '#F4F2FF' }}>תיבת לידים</span>
              <span dir="rtl" style={{ fontFamily: MONO, fontSize: 17, color: '#3FD68C' }}>4 חדשים · מויינו</span>
            </div>
            <div style={{ flex: 1 }}>
              <LeadRow initials="ד" name="דנה לוי" channel="ig" snippet="אירוע ל-30 איש, מחר בערב" temp="hot" showTag={lt > 4.4} highlight={lt > 4.4} />
              <LeadRow initials="י" name="יוסי כהן" channel="wa" snippet="מתעניין, עדיין בודק מחירים" temp="warm" showTag={lt > 4.9} />
              <LeadRow initials="מ" name="מאיה אברהם" channel="ig" snippet="רוצה הצעת מחיר להיום" temp="hot" showTag={lt > 5.4} highlight={lt > 5.4} />
              <LeadRow initials="!" name="הודעה אוטומטית" channel="ig" snippet="הזדמנות השקעה מטורפת..." temp="none" showTag={lt > 5.9} />
            </div>
          </div>
        </DashPanel>
      </div>
    </React.Fragment>);

}

// ──────────────────────── SCENE 5 — SUMMARY ───────────────────────
function SceneSummary() {
  const { localTime: lt } = useSprite();
  const C = { x: 150, y: 440, w: 780 };
  const enter = Easing.easeOutCubic(clamp(lt / 0.5, 0, 1));
  const cardScale = 0.92 + 0.08 * enter;
  const cardOp = clamp(lt / 0.4, 0, 1);

  return (
    <React.Fragment>
      <div style={{ position: 'absolute', left: 540, top: 250, transform: 'translateX(-50%)', textAlign: 'center', width: 960, opacity: capOpacity(lt, 0.3, 4.9) }}>
        <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: '0.28em', color: '#9B7CFF', marginBottom: 14 }}>AI SUMMARY</div>
        <div dir="rtl" style={{ fontFamily: HEB, fontWeight: 800, color: '#F4F2FF', fontSize: 65, whiteSpace: 'nowrap' }}>סיכום חכם לכל ליד</div>
      </div>

      <div style={{ position: 'absolute', left: C.x, top: C.y, width: C.w, opacity: cardOp, transform: `scale(${cardScale})`, transformOrigin: 'center top',
        background: '#0B0916', border: '1px solid rgba(124,92,255,0.3)', borderRadius: 28, padding: 34,
        boxShadow: '0 40px 120px rgba(0,0,0,0.6), 0 0 70px rgba(124,92,255,0.3)' }}>
        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 26 }}>
          <div style={{ width: 76, height: 76, borderRadius: '50%', background: 'linear-gradient(135deg,#9B7CFF,#5B3EE0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HEB, fontWeight: 700, fontSize: 34, color: '#fff' }}>ד</div>
          <div style={{ flex: 1, textAlign: 'right' }}>
            <div dir="rtl" style={{ fontFamily: HEB, fontWeight: 800, fontSize: 32, color: '#F4F2FF' }}>דנה לוי</div>
            <div dir="rtl" style={{ fontFamily: MONO, fontSize: 17, color: '#7C769C', marginTop: 2 }}>אינסטגרם · לפני 2 דק׳</div>
          </div>
          <div style={{ transform: 'scale(1.25)' }}><Tag temp="hot" /></div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SummaryRow label="רמת התאמה" value="גבוהה" valueColor="#3FD68C" shown={lt > 1.0} />
          <SummaryRow label="מה הלקוח צריך" value="שירות לאירוע · 30 איש" shown={lt > 1.5} />
          <SummaryRow label="איך לסגור" value="הצעה מיידית + follow-up" shown={lt > 2.1} />
        </div>

        {/* strategy box */}
        <div style={{ marginTop: 16, background: 'rgba(124,92,255,0.12)', border: '1px solid rgba(124,92,255,0.35)', borderRadius: 18, padding: '20px 22px',
          opacity: lt > 2.8 ? 1 : 0, transform: lt > 2.8 ? 'none' : 'translateY(12px)', transition: 'opacity .4s, transform .4s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end' }}>
            <span dir="rtl" style={{ fontFamily: MONO, fontSize: 16, letterSpacing: '0.16em', color: '#C4B6FD', textTransform: 'uppercase' }}>אסטרטגיית סגירה</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C4B6FD" strokeWidth="2"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="0.5" fill="#C4B6FD" /></svg>
          </div>
          <div dir="rtl" style={{ fontFamily: HEB, fontWeight: 700, fontSize: 26, color: '#F4F2FF', marginTop: 10, lineHeight: 1.4, textAlign: 'right' }}>להתקשר היום, לשלוח הצעה ולסגור תאריך</div>
        </div>
      </div>
    </React.Fragment>);

}

// ───────────────────────── SCENE 6 — FINAL ────────────────────────
function SceneFinal() {
  const { localTime: lt } = useSprite();
  const flash = lt < 0.5 ? clamp(1 - lt / 0.5, 0, 1) : 0;
  const markScale = interpolate([0, 0.7], [0.6, 1], Easing.easeOutBack)(lt);
  const markOp = clamp(lt / 0.45, 0, 1);
  const groupZoom = interpolate([0, 4], [1, 1.05], Easing.easeOutSine)(lt);
  const glowPulse = 0.7 + 0.3 * Math.sin(lt * 2.2);
  const ringScale = interpolate([0, 1.4], [0.7, 1.25], Easing.easeOutCubic)(lt);
  const ringOp = clamp((lt - 0.2) / 0.5, 0, 1) * clamp(1 - (lt - 1.4) / 0.8, 0, 1);

  const item = (at, dur = 0.5) => {
    const p = clamp((lt - at) / dur, 0, 1);
    return { opacity: clamp((lt - at) / 0.3, 0, 1), transform: `translateY(${(1 - Easing.easeOutCubic(p)) * 24}px)` };
  };
  const ctaScale = interpolate([2.1, 2.6], [0.85, 1], Easing.easeOutBack)(lt);

  return (
    <React.Fragment>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(50% 40% at 50% 42%, rgba(124,92,255,0.6), transparent 70%)', opacity: flash, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `scale(${groupZoom})` }}>
        {/* ring */}
        <div style={{ position: 'absolute', top: 560, width: 520, height: 520, borderRadius: '50%', border: '1.5px solid rgba(124,92,255,0.4)', transform: `scale(${ringScale})`, opacity: ringOp }} />
        {/* mark */}
        <div style={{ opacity: markOp, transform: `scale(${markScale})`, marginBottom: 30, filter: `drop-shadow(0 0 ${90 * glowPulse}px rgba(124,92,255,${0.7 * glowPulse}))` }}>
          <KMark size={300} glow={glowPulse} />
        </div>
        <div style={{ ...item(0.6), fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 64, letterSpacing: '0.34em', color: '#F4F2FF', marginRight: '-0.34em', marginBottom: 44 }}>KIROS</div>
        <div dir="rtl" style={{ ...item(1.1), fontFamily: HEB, fontWeight: 800, fontSize: 80, color: '#F4F2FF', textAlign: 'center', lineHeight: 1.12, letterSpacing: '-0.01em', maxWidth: 940 }}>הפוך כל הודעה ללקוח משלם</div>
        <div dir="rtl" style={{ ...item(1.5), fontFamily: HEB, fontWeight: 500, fontSize: 34, color: '#B6B0D8', textAlign: 'center', marginTop: 22 }}>אוטומציה לניהול לידים באינסטגרם ובוואטסאפ</div>
        <div style={{ opacity: item(2.1).opacity, transform: `scale(${ctaScale})`, marginTop: 50 }}>
          <div dir="rtl" style={{ fontFamily: HEB, fontWeight: 800, fontSize: 34, color: '#fff', background: 'linear-gradient(135deg,#9B7CFF,#5B3EE0)', padding: '22px 52px', borderRadius: 999, boxShadow: `0 0 ${50 * glowPulse}px rgba(124,92,255,0.6), 0 12px 40px rgba(0,0,0,0.4)` }}>
            התחל לעבוד חכם יותר ←
          </div>
        </div>
      </div>
    </React.Fragment>);

}

Object.assign(window, { SceneSolution, SceneSummary, SceneFinal });