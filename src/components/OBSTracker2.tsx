'use client';

import { useState, useEffect } from 'react';
import { formatBalance } from '../utils/format';
import type { UserData } from '../types/user';
import { subscribeToWalletBalance } from '../utils/websocket';
import Image from 'next/image';

interface Props {
  user: UserData;
}

export default function OBSTracker2({ user }: Props) {
  const [balance, setBalance] = useState<number | null>(null);
  const [initialBalance, setInitialBalance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const setupTracking = async () => {
      try {
        const unsubscribe = await subscribeToWalletBalance(user.wallet, (newBalance: number) => {
          setBalance(newBalance);
          if (initialBalance === null) {
            setInitialBalance(newBalance);
          }
        });
        cleanup = unsubscribe;
      } catch (err) {
        setError('Error connecting to WebSocket');
        console.error('WebSocket Error:', err);
      }
    };

    setupTracking();

    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [user.wallet, initialBalance]);

  // Calculate PnL
  const pnl = balance !== null && initialBalance !== null 
    ? balance - initialBalance 
    : 0;

  const wrapperStyle = {
    position: 'relative' as const,
    width: 'fit-content',
  };

  const containerStyle = {
    position: 'relative' as const,
    width: '420px',
    padding: '16px 24px',
    background: 'rgba(18, 18, 23, 0.95)',
    borderRadius: '20px',
    isolation: 'isolate' as const,
    zIndex: 1,
  };

  const gradientBorderStyle = {
    content: '""',
    position: 'absolute' as const,
    inset: '-6px',
    borderRadius: '24px',
    background: 'linear-gradient(45deg, #ff69b4, #da70d6, #b366ff, #c71585, #9370db, #ff69b4)',
    backgroundSize: '400% 400%',
    animation: 'gradientBorder 8s ease infinite',
    maskImage: 'linear-gradient(black, black)',
    maskComposite: 'exclude' as const,
    WebkitMaskImage: 'linear-gradient(black, black)',
    WebkitMaskComposite: 'xor',
    zIndex: -1,
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
    gap: '6px',
    lineHeight: '16px',
  };

  const discordLogoStyle = {
    width: '16px',
    height: '16px',
    filter: 'brightness(1.1)',
    opacity: 0.8,
    objectFit: 'contain' as const,
    display: 'block',
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
      <div style={wrapperStyle}>
        <div style={gradientBorderStyle} />
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
        <style jsx global>{`
          @keyframes gradientBorder {
            0% { background-position: 0% 50%; }
            25% { background-position: 100% 100%; }
            50% { background-position: 100% 50%; }
            75% { background-position: 0% 100%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={wrapperStyle}>
      <div style={gradientBorderStyle} />
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
            <div style={statTitleStyle}>Session PnL</div>
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
                {pnl >= 0 ? '+' : ''}{formatBalance(pnl)}
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
      <style jsx global>{`
        @keyframes gradientBorder {
          0% { background-position: 0% 50%; }
          25% { background-position: 100% 100%; }
          50% { background-position: 100% 50%; }
          75% { background-position: 0% 100%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
} 