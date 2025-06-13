// src/utils/level.ts
export function calculateLevel(totalGames: number): number {
  return totalGames <= 10 ? totalGames : 10 + Math.floor((totalGames - 10) / 3);
}
