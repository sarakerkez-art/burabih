import { useEffect, useRef, useState } from "react";
import type { Lang } from "@/lib/i18n";

type Props = { pm25: number | null; lang?: Lang; bubbleText?: string; captionText?: string };

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

export function Buri({ pm25, lang = "bs", bubbleText, captionText }: Props) {
  const v = pm25 ?? 20;
  const state = stateOf(v);
  const baseCopy = COPY[lang][state];
  const copy = {
    caption: captionText ?? baseCopy.caption,
    bubble: bubbleText ?? baseCopy.bubble,
  };

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
  const eyeY = state === "clean" ? 68 : state === "moderate" ? 69 : state === "unhealthy" ? 71 : 70;

  // Mouth — face expressions, centered in cloud body
  const mouth =
    state === "clean"     ? "M52 78 Q60 87 68 78" :   // grin
    state === "moderate"  ? "M53 79 Q60 83 67 79" :   // small smile
    state === "unhealthy" ? "M53 81 Q60 77 67 81" :   // frown
                            "M54 82 Q60 78 66 82";    // sad

  return (
    <div className="flex flex-col items-center justify-center select-none">
      <div className="relative" style={{ width: 240, height: 220 }}>
        {/* Speech bubble */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 -top-4 transition-all duration-300 ${
            bubble ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
          }`}
          style={{ transformOrigin: "50% 100%" }}
        >
          <div className="relative bg-white text-[color:var(--forest)] text-xs font-medium leading-snug px-4 py-2.5 rounded-2xl shadow-lg text-center w-[240px]">
            {copy.bubble}
            {/* Soft, rounded tail flowing into Buri */}
            <svg
              className="absolute left-1/2 -translate-x-1/2 -bottom-[10px]"
              width="22"
              height="14"
              viewBox="0 0 22 14"
              fill="white"
              aria-hidden="true"
            >
              <path d="M0 0 C 6 0, 8 12, 11 13 C 14 12, 16 0, 22 0 Z" />
            </svg>
          </div>
        </div>

        <div
          ref={wrapRef}
          onClick={showBubble}
          className={`buri-wake absolute inset-0 flex items-center justify-center cursor-pointer ${bodyAnim}`}
          style={{ transition: "filter 1s ease-in-out" }}
        >
          <svg
            width="190"
            height="210"
            viewBox="0 0 120 140"
            fill="none"
            style={{
              filter: state === "hazardous" ? "grayscale(0.55) brightness(0.92)" : "none",
              transition: "filter 1s ease-in-out",
            }}
          >
            <defs>
              <radialGradient id="buriBody" cx="50%" cy="55%" r="60%">
                <stop offset="0%" stopColor="#FAFAF8" stopOpacity="1" />
                <stop offset="80%" stopColor="#FAFAF8" stopOpacity="0.96" />
                <stop offset="100%" stopColor="#FAFAF8" stopOpacity="0.55" />
              </radialGradient>
            </defs>

            {/* Tiny wisp on top — waves on first visit */}
            <g
              className={wave ? "buri-wave" : ""}
              stroke="#FAFAF8"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeOpacity="0.7"
              fill="none"
            >
              <path d="M40 32 Q46 26 54 30" />
              <path d="M66 30 Q74 24 82 30" />
            </g>

            {/* Cloud body — bumpy, like Lovable logo, breathes */}
            <path
              d="M30 86 C 18 86 14 70 26 64 C 22 50 38 42 48 50 C 52 38 70 38 76 50 C 90 46 100 60 92 70 C 102 78 96 92 84 90 C 80 100 64 100 58 92 C 50 100 34 98 30 86 Z"
              fill="url(#buriBody)"
            />

            {/* Cheeks */}
            <circle cx="44" cy="76" r="4" fill="var(--amber-brand)" opacity="0.55" />
            <circle cx="76" cy="76" r="4" fill="var(--amber-brand)" opacity="0.55" />

            {/* Eyes */}
            {eyesOpen ? (
              <g>
                <circle cx="50" cy={eyeY} r="4.2" fill="#1A2E1A" opacity="0.08" />
                <circle cx="70" cy={eyeY} r="4.2" fill="#1A2E1A" opacity="0.08" />
                <circle cx={50 + eye.x} cy={eyeY + eye.y} r="2.6" fill="#1A2E1A" />
                <circle cx={70 + eye.x} cy={eyeY + eye.y} r="2.6" fill="#1A2E1A" />
              </g>
            ) : (
              <g stroke="#1A2E1A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.85">
                <path d="M45 74 Q50 70 55 74" />
                <path d="M65 74 Q70 70 75 74" />
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
          </svg>
        </div>
      </div>

      <p className="-mt-1 text-xs sm:text-sm text-center text-[color:var(--offwhite)]/80 max-w-[15rem]">
        {copy.caption}
      </p>
    </div>
  );
}
