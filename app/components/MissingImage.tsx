"use client";

export default function MissingImage({ size = 32, className = "" }: { size?: number; className?: string }) {
  const s = size;
  return (
    <div className={`flex items-center justify-center bg-gray-600/20 text-gray-300 ${className}`} style={{ width: s, height: s }}>
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <rect x="1" y="1" width="22" height="22" rx="4" stroke="#9CA3AF" strokeWidth="1.5" fill="rgba(17,24,39,0.02)" />
        <path d="M4 16l4-6 4 8 6-10 0 8" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    </div>
  );
}
