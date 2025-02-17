export function formatBalance(balance: number): string {
  return balance.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function calculatePnL(currentBalance: number, baseline: number): number {
  if (baseline === 0) return 0;
  return ((currentBalance - baseline) / baseline) * 100;
} 