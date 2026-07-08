type ScoreRingProps = {
  label: string;
  score: number;
  muted?: boolean;
};

export function ScoreRing({ label, score, muted }: ScoreRingProps) {
  const value = Math.max(0, Math.min(100, Math.round(score)));
  return (
    <div className="nexx-card p-5">
      <div
        className="grid h-24 w-24 place-items-center rounded-full"
        style={{
          background: `conic-gradient(${muted ? "#6f6a5f" : "#2563eb"} ${value * 3.6}deg, #e3ddd2 0deg)`
        }}
      >
        <div className="grid h-20 w-20 place-items-center rounded-full bg-white text-2xl font-semibold text-[#171714]">
          {value}
        </div>
      </div>
      <p className="mt-4 text-sm font-semibold text-[#171714]">{label}</p>
      <p className="mt-1 text-xs text-[#6f6a5f]">AI-estimated score</p>
    </div>
  );
}
