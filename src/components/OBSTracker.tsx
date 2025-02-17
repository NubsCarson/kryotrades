'use client';

import { useState, useEffect } from 'react';
import { formatBalance, calculatePnL } from '../utils/format';
import type { UserData } from '../types/user';
import { fetchBalance } from '../utils/solana';
import Image from 'next/image';

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

  const containerStyle = {
    borderRadius: '20px',
    width: '468px',
    padding: '16px 24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
    border: '4px solid #b366ff',
  };

  const rowStyle = {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    gap: '32px',
  };

  const columnStyle = {
    flex: '1',
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
  };

  const statTitleStyle = {
    fontSize: '14px',
    color: '#ff69b4',
    textTransform: 'uppercase' as const,
    marginBottom: '4px',
    fontWeight: 'bold' as const,
    letterSpacing: '0.05em',
  };

  const valueContainerStyle = {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '8px',
  };

  const statValueStyle = {
    fontSize: '36px',
    fontWeight: 'bold' as const,
    lineHeight: '1',
    fontFamily: 'monospace',
  };

  const footerStyle = {
    fontSize: '12px',
    color: '#b0b0b0',
    marginTop: '12px',
    textAlign: 'center' as const,
    opacity: 0.7,
    letterSpacing: '0.02em',
  };

  const logoStyle = {
    width: '24px',
    height: '24px',
    marginRight: '4px',
    position: 'relative' as const,
    top: '-2px',
  };

  if (error) {
    return (
      <div className="obs-card" style={containerStyle}>
        <span style={{ color: '#ff0000' }}>
          Error: {error}
        </span>
      </div>
    );
  }

  return (
    <div className="obs-card" style={containerStyle}>
      <div style={rowStyle}>
        <div style={columnStyle}>
          <div style={statTitleStyle}>Balance</div>
          <div style={valueContainerStyle}>
            <Image 
              src="/solana_logo.png" 
              alt="SOL" 
              width={24} 
              height={24} 
              style={logoStyle}
            />
            <span style={{ ...statValueStyle, color: '#00ffff' }}>
              {formatBalance(balance)}
            </span>
          </div>
        </div>
        
        <div style={columnStyle}>
          <div style={statTitleStyle}>PnL Today</div>
          <div style={valueContainerStyle}>
            <Image 
              src="/solana_logo.png" 
              alt="SOL" 
              width={24} 
              height={24} 
              style={logoStyle}
            />
            <span style={{
              ...statValueStyle,
              color: pnl >= 0 ? '#00ff00' : '#ff4444',
            }}>
              {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div style={footerStyle}>
        join us at discord.gg/pumpdotfun
      </div>
    </div>
  );
} 