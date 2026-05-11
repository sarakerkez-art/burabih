import { useEffect, useRef, useState } from "react";
import type { Lang } from "@/lib/i18n";

type Props = { pm25: number | null; lang?: Lang };

type State = "clean" | "moderate" | "unhealthy" | "hazardous";

function stateOf(v: number): State {
  if (v < 10) return "clean";
  if (v < 25) return "moderate";
  if (v < 50) return "unhealthy";
  return "hazardous";
}

const COPY: Record<Lang, Record<State, { caption: string; bubble: string }>> = {
  bs: {
    clean:      { caption: "Zrak je čist danas! 🌬️",          bubble: "Danas možete izaći van! ☀️" },
    moderate:   { caption: "Umjereno zagađenje danas.",         bubble: "Pažljivo danas, posebno djeca." },
    unhealthy:  { caption: "Zrak nije dobar danas.",            bubble: "Prozračite kratko u 14h." },
    hazardous:  { caption: "Opasno zagađenje. Ostanite unutra.", bubble: "Ostanite unutra. Zatvorite prozore." },
  },
  en: {
    clean:      { caption: "The air is clean today! 🌬️",       bubble: "You can head outside today! ☀️" },
    moderate:   { caption: "Moderate pollution today.",          bubble: "Be careful today, especially kids." },
    unhealthy:  { caption: "Air isn't good today.",              bubble: "Air briefly around 2pm." },
    hazardous:  { caption: "Hazardous pollution. Stay inside.",  bubble: "Stay inside. Close the windows." },
  },
};

export function Buri({ pm25, lang = "bs" }: Props) {
  const v = pm25 ?? 20;
  const state = stateOf(v);
  const copy = COPY[lang][state];

  const wrapRef = useRef<HTMLDivElement>(null);
  const [eye, setEye] = useState({ x: 0, y: 0 });
  const [bubble, setBubble] = useState(false);
  const [wave, setWave] = useState(false);
  const bubbleTimer = useRef<number | null>(null);

  // Eyes follow cursor
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const d = Math.hypot(dx, dy) || 1;
      const max = 1.4;
      setEye({ x: (dx / d) * Math.min(max, d / 80), y: (dy / d) * Math.min(max, d / 80) });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // First visit wave
  useEffect(() => {
    try {
      if (!localStorage.getItem("bura.buri.waved")) {
        const t = window.setTimeout(() => {
          setWave(true);
          window.setTimeout(() => setWave(false), 1600);
          localStorage.setItem("bura.buri.waved", "1");
        }, 900);
        return () => window.clearTimeout(t);
      }
    } catch { /* ignore */ }
  }, []);

  const showBubble = () => {
    setBubble(true);
    if (bubbleTimer.current) window.clearTimeout(bubbleTimer.current);
    bubbleTimer.current = window.setTimeout(() => setBubble(false), 3000);
  };

  useEffect(() => () => { if (bubbleTimer.current) window.clearTimeout(bubbleTimer.current); }, []);

  // All states share the same gentle breathing animation (Lovable-logo-like).
  const bodyAnim = "buri-breathe";

  // Eyes
  const eyesOpen = state !== "hazardous";
  const eyeY = state === "clean" ? 72 : state === "moderate" ? 73 : state === "unhealthy" ? 75 : 74;

  // Mouth — face expressions like before
  const mouth =
    state === "clean"     ? "M48 88 Q60 100 72 88" :   // grin
    state === "moderate"  ? "M50 90 Q60 94 70 90" :    // small smile
    state === "unhealthy" ? "M50 92 Q60 88 70 92" :    // frown
                            "M52 94 Q60 90 68 94";     // sad

  return (
    <div className="flex flex-col items-center justify-center select-none">
      <div className="relative" style={{ width: 160, height: 180 }}>
        {/* Speech bubble */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 -top-2 transition-all duration-300 ${
            bubble ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
          }`}
          style={{ transformOrigin: "50% 100%" }}
        >
          <div className="relative bg-white text-[color:var(--forest)] text-xs font-medium px-3 py-2 rounded-2xl shadow-lg whitespace-nowrap max-w-[220px]">
            {copy.bubble}
            <span
              className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 rotate-45"
              style={{ background: "var(--amber-brand)" }}
            />
          </div>
        </div>

        <div
          ref={wrapRef}
          onClick={showBubble}
          className={`buri-wake absolute inset-0 flex items-center justify-center cursor-pointer ${bodyAnim}`}
          style={{ transition: "filter 1s ease-in-out" }}
        >
          <svg
            width="120"
            height="140"
            viewBox="0 0 120 140"
            fill="none"
            style={{
              filter: state === "hazardous" ? "grayscale(0.55) brightness(0.92)" : "none",
              transition: "filter 1s ease-in-out",
            }}
          >
            {/* Soft outer glow / transparent edge */}
            <defs>
              <radialGradient id="buriBody" cx="50%" cy="55%" r="55%">
                <stop offset="0%" stopColor="#FAFAF8" stopOpacity="1" />
                <stop offset="75%" stopColor="#FAFAF8" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#FAFAF8" stopOpacity="0.45" />
              </radialGradient>
            </defs>

            {/* Hair / wind tufts on top */}
            <g
              className={wave ? "buri-wave" : "buri-hair"}
              stroke="#FAFAF8"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeOpacity="0.85"
              fill="none"
            >
              {state === "clean" || state === "moderate" ? (
                <>
                  <path d="M48 26 Q52 14 60 18" />
                  <path d="M60 22 Q62 8 70 14" />
                  <path d="M70 26 Q78 16 82 24" />
                </>
              ) : state === "unhealthy" ? (
                <>
                  <path d="M48 28 Q50 22 58 26" />
                  <path d="M60 26 Q62 20 70 26" />
                  <path d="M70 28 Q76 24 80 30" />
                </>
              ) : (
                <>
                  <path d="M50 30 Q54 36 58 32" />
                  <path d="M60 30 Q64 38 68 32" />
                  <path d="M70 30 Q76 38 80 32" />
                </>
              )}
            </g>

            {/* Body — teardrop pointing up */}
            <path
              d="M60 28 C 32 50 28 92 60 110 C 92 92 88 50 60 28 Z"
              fill="url(#buriBody)"
            />

            {/* Cheeks */}
            <circle cx="42" cy="74" r="4.5" fill="var(--amber-brand)" opacity="0.55" />
            <circle cx="78" cy="74" r="4.5" fill="var(--amber-brand)" opacity="0.55" />

            {/* Eyes */}
            {eyesOpen ? (
              <g>
                <circle cx="48" cy={eyeY} r="4.2" fill="#FAFAF8" />
                <circle cx="72" cy={eyeY} r="4.2" fill="#FAFAF8" />
                <circle cx={48 + eye.x} cy={eyeY + eye.y} r="1.8" fill="#1A2E1A" />
                <circle cx={72 + eye.x} cy={eyeY + eye.y} r="1.8" fill="#1A2E1A" />
              </g>
            ) : (
              <g stroke="#1A2E1A" strokeWidth="1.8" strokeLinecap="round">
                <path d="M44 62 Q48 65 52 62" />
                <path d="M68 62 Q72 65 76 62" />
              </g>
            )}

            {/* Mouth */}
            <path
              d={mouth}
              stroke="#1A2E1A"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
            />

            {/* Hand covering mouth (unhealthy state) */}
            {state === "unhealthy" && (
              <ellipse
                cx="60"
                cy="84"
                rx="9"
                ry="4.5"
                fill="#FAFAF8"
                opacity="0.9"
              />
            )}
          </svg>
        </div>
      </div>

      <p className="mt-3 text-xs sm:text-sm text-center text-[color:var(--offwhite)]/80 max-w-[14rem]">
        {copy.caption}
      </p>
    </div>
  );
}
