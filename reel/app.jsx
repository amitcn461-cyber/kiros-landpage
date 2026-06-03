/* global React, ReactDOM, Stage, Sprite, useTime, useTimeline,
   TimeBackdrop, SceneHook, SceneIgnored, SceneLost, SceneSolution, SceneSummary, SceneFinal */
// KIROS Reel — app assembly (Stage + scene windows + SFX + comment labels)

const SFX = window.KirosSFX || { unlock() {} };

// Scene boundaries (seconds)
const T = {
  hook:     [0.0, 4.2],
  ignored:  [4.2, 10.5],
  lost:     [10.5, 17.2],
  solution: [17.2, 25.8],
  summary:  [25.8, 31.0],
  final:    [31.0, 35.0],
};
const DURATION = 35.0;

// SFX cues: fire when the playhead crosses t during forward playback
const CUES = [
  { t: 0.15, f: () => SFX.whoosh() },
  { t: 2.15, f: () => SFX.ping() },          // hook: IG notification
  { t: 5.4,  f: () => SFX.pingUrgent() },     // ignored: "יש מישהו?"
  { t: 6.0,  f: () => SFX.tick() },
  { t: 7.0,  f: () => SFX.tick() },
  { t: 7.6,  f: () => SFX.pingUrgent() },     // ignored: "דחוף"
  { t: 8.2,  f: () => SFX.tick() },
  { t: 11.4, f: () => SFX.lost() },           // lost: read/abandoned
  { t: 12.7, f: () => SFX.whooshDown() },     // slide to competitor
  { t: 14.6, f: () => SFX.confirm() },        // competitor instant reply
  { t: 17.25,f: () => SFX.whoosh() },         // transition to dashboard
  { t: 18.9, f: () => SFX.success() },        // AI reply
  { t: 20.3, f: () => SFX.success() },        // AI tags hot
  { t: 21.6, f: () => SFX.pop() },            // tag pops
  { t: 22.1, f: () => SFX.pop() },
  { t: 22.6, f: () => SFX.pop() },
  { t: 23.1, f: () => SFX.pop() },
  { t: 25.85,f: () => SFX.materialize() },    // summary card
  { t: 26.9, f: () => SFX.pop() },
  { t: 27.4, f: () => SFX.pop() },
  { t: 28.0, f: () => SFX.pop() },
  { t: 28.7, f: () => SFX.success() },        // strategy
  { t: 31.15,f: () => SFX.whoosh() },         // final transition
  { t: 31.3, f: () => SFX.chime() },          // brand chime
];

function SfxTrack() {
  const t = useTime();
  const { playing } = useTimeline();
  const prev = React.useRef(t);
  React.useEffect(() => {
    const p = prev.current, now = t, dt = now - p;
    if (playing && dt > 0 && dt < 0.4) {
      for (const c of CUES) if (p < c.t && c.t <= now) { try { c.f(); } catch (e) {} }
    }
    prev.current = now;
  }, [t, playing]);
  return null;
}

// Update the comment label each whole second
function LabelTrack() {
  const t = useTime();
  const sec = Math.floor(t);
  React.useEffect(() => {
    const el = document.getElementById('reel-root');
    if (el) el.dataset.screenLabel = `t=${sec}s`;
  }, [sec]);
  return null;
}

function SeekBridge() {
  const { setTime, setPlaying } = useTimeline();
  React.useEffect(() => {
    window.__seek = (t) => { setPlaying(false); setTime(t); };
    window.__play = () => setPlaying(true);
  }, [setTime, setPlaying]);
  return null;
}

function Reel() {
  return (
    <Stage width={1080} height={1920} duration={DURATION} background="#06050A" persistKey="kiros-reel" fps={60}>
      <SeekBridge />
      <TimeBackdrop />
      <Sprite start={T.hook[0]}     end={T.hook[1]}>{() => <SceneHook />}</Sprite>
      <Sprite start={T.ignored[0]}  end={T.ignored[1]}>{() => <SceneIgnored />}</Sprite>
      <Sprite start={T.lost[0]}     end={T.lost[1]}>{() => <SceneLost />}</Sprite>
      <Sprite start={T.solution[0]} end={T.solution[1]}>{() => <SceneSolution />}</Sprite>
      <Sprite start={T.summary[0]}  end={T.summary[1]}>{() => <SceneSummary />}</Sprite>
      <Sprite start={T.final[0]}    end={T.final[1]}>{() => <SceneFinal />}</Sprite>
      <SfxTrack />
      <LabelTrack />
    </Stage>
  );
}

// unlock audio on first interaction
['pointerdown', 'keydown', 'click'].forEach(ev =>
  window.addEventListener(ev, () => SFX.unlock(), { once: false }));

ReactDOM.createRoot(document.getElementById('root')).render(<Reel />);
