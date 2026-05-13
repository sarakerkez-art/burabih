import { useState } from "react";

export type SchoolPin = {
  id: string;
  name: string;
  status: string;
  // percent coordinates inside viewBox
  x: number;
  y: number;
  color?: "green" | "amber" | "blue";
  href?: string;
  moreLabel?: string;
};

type Props = {
  pins?: SchoolPin[];
  className?: string;
  showTooltips?: boolean;
};

const COLOR: Record<string, string> = {
  green: "#3FAE5A",
  amber: "var(--amber-brand)",
  blue: "#3D7AB5",
};

// Simplified BiH outline — stylised, not cartographically accurate.
const BIH_PATH =
  "M 60 70 Q 90 50 130 55 Q 175 48 220 60 Q 260 68 290 90 Q 320 115 335 150 Q 345 185 330 215 Q 320 245 290 265 Q 255 285 215 285 Q 180 290 150 275 Q 115 265 90 240 Q 65 215 55 180 Q 45 145 50 110 Q 53 85 60 70 Z";

export function BiHMap({ pins = [], className, showTooltips = true }: Props) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className={`relative w-full max-w-xl mx-auto ${className ?? ""}`}>
      <svg viewBox="0 0 400 340" className="w-full h-auto" role="img" aria-label="Map of Bosnia and Herzegovina">
        <path
          d={BIH_PATH}
          fill="var(--sage)"
          stroke="var(--forest)"
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        {pins.map((p) => {
          const cx = (p.x / 100) * 400;
          const cy = (p.y / 100) * 340;
          const fill = COLOR[p.color ?? "green"];
          return (
            <g key={p.id} style={{ cursor: showTooltips ? "pointer" : "default" }}>
              <circle
                cx={cx}
                cy={cy}
                r={14}
                fill={fill}
                opacity={0.25}
              />
              <circle
                cx={cx}
                cy={cy}
                r={7}
                fill={fill}
                stroke="white"
                strokeWidth={2}
                onMouseEnter={() => showTooltips && setActive(p.id)}
                onMouseLeave={() => showTooltips && setActive(null)}
                onClick={() => showTooltips && setActive((s) => (s === p.id ? null : p.id))}
              />
            </g>
          );
        })}
      </svg>
      {showTooltips &&
        pins.map((p) => {
          if (active !== p.id) return null;
          return (
            <div
              key={`tip-${p.id}`}
              className="absolute z-10 bg-card border border-border rounded-lg shadow-lg p-3 text-xs w-52 -translate-x-1/2"
              style={{ left: `${p.x}%`, top: `calc(${p.y}% + 18px)` }}
            >
              <div className="font-semibold">{p.name}</div>
              <div className="text-muted-foreground mt-1">Status: {p.status}</div>
              {p.href && (
                <a href={p.href} className="mt-2 inline-block text-amber-brand font-medium">
                  {p.moreLabel ?? "Više info →"}
                </a>
              )}
            </div>
          );
        })}
    </div>
  );
}
