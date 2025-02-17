'use client';

import { useState, useEffect } from 'react';
import { formatBalance, calculatePnL } from '../utils/format';
import type { UserData } from '../types/user';
import { fetchBalance } from '../utils/solana';

interface Props {
  initialData: UserData;
}

export default function OBSTracker({ initialData }: Props) {
  const [balance, setBalance] = useState<number>(initialData.balance || 0);
  const [pnl, setPnL] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const updateBalance = async () => {
      try {
        setError(null);
        const newBalance = await fetchBalance(initialData.wallet);
        
        if (newBalance === null) {
          setError('Failed to fetch balance');
          return;
        }

        setBalance(newBalance);
        setPnL(calculatePnL(newBalance, initialData.baseline));
      } catch (err) {
        setError('Error updating balance');
        console.error('Error:', err);
      }
    };

    updateBalance();
    const interval = setInterval(updateBalance, 5000);
    return () => clearInterval(interval);
  }, [initialData.wallet, initialData.baseline]);

  if (error) {
    return (
      <div className="font-mono text-sm text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="font-mono text-sm">
      <div className="flex items-center gap-4">
        <div>
          <span className="text-muted-foreground">Balance:</span>{' '}
          <span className="text-foreground">{formatBalance(balance)} SOL</span>
        </div>
        <div>
          <span className="text-muted-foreground">PnL:</span>{' '}
          <span className={pnl >= 0 ? 'text-green-400' : 'text-red-400'}>
            {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
} 