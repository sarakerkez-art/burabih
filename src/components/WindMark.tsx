export function WindMark({ size = 22, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg
      className="wind-icon inline-block"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 12h14a4 4 0 1 0-4-4" />
      <path d="M3 18h20a4 4 0 1 1-4 4" />
      <path d="M3 24h10" />
    </svg>
  );
}
