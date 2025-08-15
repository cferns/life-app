export const formatLabel = (raw: string): string => {
  const words = (raw || '').trim().split(/\s+/);
  if (words.length <= 2) return words.join(' ');
  return `${words[0]} ${words[1]}…`;
};

export const clampPct = (v: number) => Math.max(2, Math.min(98, v));

