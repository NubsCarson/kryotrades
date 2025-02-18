'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { subscribeToWalletBalance } from '../utils/websocket';
import { formatBalance } from '../utils/format';
import type { UserData } from '../types/user';
import Image from 'next/image';
import { MessageCircle, Copy, Check } from 'lucide-react';

interface Props {
  initialData: UserData;
}

export default function SolanaTracker({ initialData }: Props) {
  const [balance, setBalance] = useState<number>(initialData.balance || 0);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(initialData.wallet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  useEffect(() => {
    let isSubscribed = true;

    const setupTracking = async () => {
      try {
        setError(null);
        const unsubscribe = await subscribeToWalletBalance(
          initialData.wallet,
          (newBalance) => {
            if (isSubscribed) {
              setBalance(newBalance);
            }
          }
        );

        return () => {
          isSubscribed = false;
          unsubscribe();
        };
      } catch (err) {
        setError('Error connecting to WebSocket');
        console.error('WebSocket Error:', err);
        return () => {};
      }
    };

    setupTracking().then(cleanup => {
      return () => {
        cleanup();
      };
    });
  }, [initialData.wallet]);

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-red-500/20 bg-black/95 p-6 shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10" />
          <p className="relative text-center text-sm font-medium text-red-500">
            {error}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-[#1a1a1a] bg-[#0f0f0f] p-8 shadow-2xl mx-4"
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 opacity-50" />
        
        {/* Content */}
        <div className="relative space-y-8">
          {/* User info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-r from-primary via-secondary to-accent p-[2px]">
                <div className="h-full w-full rounded-full bg-[#0f0f0f] p-2">
                  <Image
                    src="/solana_logo.png"
                    alt="SOL"
                    width={24}
                    height={24}
                    className="h-full w-full"
                  />
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {initialData.username}
                </h2>
                <p className="text-sm text-[#a0a0a0]">
                  {initialData.wallet.slice(0, 4)}...{initialData.wallet.slice(-4)}
                </p>
              </div>
            </div>
            
            <motion.button
              onClick={copyToClipboard}
              className="rounded-full bg-[#1a1a1a] p-2 text-primary transition-all hover:bg-[#262626] hover:text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {copied ? (
                <Check className="h-5 w-5 text-green-400" />
              ) : (
                <Copy className="h-5 w-5" />
              )}
            </motion.button>
          </div>

          {/* Balance */}
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-wider text-[#a0a0a0]">
              Balance
            </p>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-bold tracking-tight text-white">
                {formatBalance(balance)}
              </span>
              <span className="text-lg font-medium text-primary">SOL</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-[#1a1a1a] pt-4">
            <p className="text-sm text-[#a0a0a0]">
              Real-time updates via RPC
            </p>
            <motion.a
              href="https://discord.gg/pumpdotfun"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 rounded-full bg-[#5865F2] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#4752C4]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle className="h-4 w-4" />
              <span>Join Discord</span>
            </motion.a>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 