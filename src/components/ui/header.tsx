'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export function Header() {
  const pathname = usePathname();

  // Don't render the header on OBS pages
  if (pathname?.startsWith('/obs')) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
      <nav className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold tracking-tight">
            Solana<span className="gradient-text">Tracker</span>
          </span>
        </Link>

        {/* Discord Button */}
        <motion.a
          href="https://discord.gg/pumpdotfun"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative overflow-hidden rounded-full bg-[#5865F2] px-6 py-2 transition-all duration-300 hover:bg-[#4752C4] hover:shadow-[0_0_20px_rgba(88,101,242,0.5)]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#5865F2]/0 via-[#5865F2]/50 to-[#5865F2]/0 opacity-0 transition-opacity group-hover:animate-shine" />
          <span className="flex items-center space-x-2 text-white">
            <MessageCircle className="h-5 w-5" />
            <span className="font-medium">Join Discord</span>
          </span>
        </motion.a>
      </nav>
    </header>
  );
} 