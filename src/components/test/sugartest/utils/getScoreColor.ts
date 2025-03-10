export function getScoreColor(score: string) {
  const scoreNumber = Number(score);
  if (scoreNumber < 2.1) return "from-emerald-400 to-emerald-500";
  if (scoreNumber < 3.1) return "from-amber-400 to-amber-500";
  if (scoreNumber < 4.1) return "from-orange-400 to-orange-500";
  return "from-red-400 to-red-500";
}
