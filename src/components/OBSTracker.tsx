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

  const baseStyle = {
    background: 'transparent',
    backgroundColor: 'transparent',
    fontFamily: 'monospace',
    fontSize: '1.25rem',
    textShadow: '2px 2px 4px rgba(0,0,0,1)',
  };

  if (error) {
    return (
      <div style={{
        ...baseStyle,
        color: '#ef4444',
      }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div style={{
      ...baseStyle,
      display: 'flex',
      alignItems: 'center',
      gap: '2rem',
      color: 'white',
      background: 'transparent',
      backgroundColor: 'transparent',
    }}>
      <div style={{ background: 'transparent' }}>
        Balance: <strong style={{ background: 'transparent' }}>{formatBalance(balance)} SOL</strong>
      </div>
      <div style={{ background: 'transparent' }}>
        PnL:{' '}
        <strong style={{
          background: 'transparent',
          color: pnl >= 0 ? '#4ade80' : '#ef4444',
          textShadow: `2px 2px 8px ${pnl >= 0 ? 'rgba(74, 222, 128, 0.8)' : 'rgba(239, 68, 68, 0.8)'}`,
        }}>
          {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)}%
        </strong>
      </div>
    </div>
  );
} 