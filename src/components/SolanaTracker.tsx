'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatBalance } from '../utils/format';
import type { UserData } from '../types/user';
import { subscribeToWalletBalance } from '../utils/websocket';

interface Props {
  initialData: UserData;
}

export default function SolanaTracker({ initialData }: Props) {
  const [balance, setBalance] = useState<number>(initialData.balance || 0);
  const [pnl, setPnL] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isSubscribed = true;

    const setupTracking = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const unsubscribe = await subscribeToWalletBalance(
          initialData.wallet,
          (newBalance, newPnL) => {
            if (isSubscribed) {
              setBalance(newBalance);
              setPnL(newPnL);
              setIsLoading(false);
            }
          }
        );

        return () => {
          isSubscribed = false;
          unsubscribe();
        };
      } catch (err) {
        setError('Failed to connect to WebSocket. Please try again later.');
        console.error('WebSocket Error:', err);
        setIsLoading(false);
        return () => {};
      }
    };

    setupTracking().then(cleanup => {
      return () => {
        cleanup();
      };
    });
  }, [initialData.wallet]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-10 px-4">
      <div className="mx-auto w-full max-w-4xl space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 text-center"
        >
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            <span className="gradient-text">{initialData.username}</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Tracking wallet performance in real-time
          </p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-center text-red-400"
          >
            {error}
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="gradient-border group"
          >
            <div className="relative h-full rounded-lg bg-card p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-muted-foreground">
                  Current Balance
                </h3>
                <div className="flex items-center gap-3">
                  {isLoading ? (
                    <div className="h-9 w-32 animate-pulse rounded-md bg-muted/20" />
                  ) : (
                    <span className="text-3xl font-bold gradient-text">
                      {formatBalance(balance)} SOL
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="gradient-border group"
          >
            <div className="relative h-full rounded-lg bg-card p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-muted-foreground">
                  24h PnL
                </h3>
                <div className="flex items-center gap-3">
                  {isLoading ? (
                    <div className="h-9 w-24 animate-pulse rounded-md bg-muted/20" />
                  ) : (
                    <span className={`text-3xl font-bold ${
                      pnl >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {pnl >= 0 ? '+' : ''}{formatBalance(pnl)} SOL
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* External Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center"
        >
          <a
            href={`https://solscan.io/account/${initialData.wallet}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent"
          >
            View on Solscan
          </a>
        </motion.div>
      </div>
    </div>
  );
} 