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
    width: '420px',
    padding: '16px 24px',
    background: 'rgba(18, 18, 23, 0.95)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(179, 102, 255, 0.2)',
    border: '4px solid #b366ff',
    backdropFilter: 'blur(12px)' as const,
  };

  const rowStyle = {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    gap: '36px',
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
    marginBottom: '6px',
    fontWeight: '600' as const,
    letterSpacing: '0.08em',
    textShadow: '0 0 8px rgba(255, 105, 180, 0.3)',
  };

  const valueContainerStyle = {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '8px',
    height: '44px',
    padding: '0 4px',
  };

  const statValueStyle = {
    fontSize: '36px',
    fontWeight: '700' as const,
    lineHeight: '44px',
    fontFamily: 'Monaco, Consolas, monospace',
    display: 'flex',
    alignItems: 'center',
    textShadow: '0 0 12px rgba(0, 255, 255, 0.3)',
  };

  const footerStyle = {
    fontSize: '12px',
    color: '#9ca3af',
    marginTop: '12px',
    textAlign: 'center' as const,
    opacity: 0.8,
    letterSpacing: '0.02em',
    fontWeight: '400' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
  };

  const discordLogoStyle = {
    width: '16px',
    height: '16px',
    filter: 'brightness(1.1)',
    opacity: 0.8,
    position: 'relative' as const,
    top: '-1px',
    objectFit: 'contain' as const,
  };

  const logoStyle = {
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
    top: '1px',
    filter: 'drop-shadow(0 0 4px rgba(179, 102, 255, 0.4))',
  };

  if (error) {
    return (
      <div className="obs-card" style={containerStyle}>
        <span style={{ 
          color: '#ff4444',
          textShadow: '0 0 8px rgba(255, 68, 68, 0.3)',
          fontSize: '14px',
          fontWeight: '500',
        }}>
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
              width={28} 
              height={28} 
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
              width={28} 
              height={28} 
              style={logoStyle}
            />
            <span style={{
              ...statValueStyle,
              color: pnl >= 0 ? '#00ff00' : '#ff4444',
              textShadow: pnl >= 0 
                ? '0 0 12px rgba(0, 255, 0, 0.3)' 
                : '0 0 12px rgba(255, 68, 68, 0.3)',
            }}>
              {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div style={footerStyle}>
        <span>join us at discord.gg/pumpdotfun</span>
        <Image 
          src="/discord.png" 
          alt="Discord" 
          width={16} 
          height={16} 
          style={discordLogoStyle}
          quality={100}
          priority
        />
      </div>
    </div>
  );
} 