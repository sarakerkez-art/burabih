type Props = { pm25: number | null };

export function Buri({ pm25 }: Props) {
  const v = pm25 ?? 30;
  const cls =
    v < 10 ? "buri-happy" :
    v < 25 ? "buri-calm" :
    v < 50 ? "buri-slow" : "buri-tired";

  // Eyes droop when sad
  const eyeY = v < 25 ? 16 : v < 50 ? 17 : 18;
  const mouthD =
    v < 10 ? "M22 22 Q26 26 30 22" :
    v < 25 ? "M22 22 Q26 24 30 22" :
    v < 50 ? "M22 24 Q26 22 30 24" : "M22 25 Q26 21 30 25";

  return (
    <div className="flex items-center justify-center" aria-label="Buri">
      <svg
        className={cls}
        width="160"
        height="160"
        viewBox="0 0 52 52"
        fill="none"
      >
        {/* Wind body */}
        <path
          d="M6 18 H30 a6 6 0 1 0 -6 -6"
          stroke="#FAFAF8"
          strokeWidth="2.6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M4 26 H38 a7 7 0 1 1 -7 7"
          stroke="#FAFAF8"
          strokeWidth="2.6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M8 34 H22"
          stroke="#FAFAF8"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        {/* Face */}
        <circle cx="22" cy={eyeY} r="1.4" fill="#FAFAF8" />
        <circle cx="30" cy={eyeY} r="1.4" fill="#FAFAF8" />
        <path d={mouthD} stroke="#FAFAF8" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
}
