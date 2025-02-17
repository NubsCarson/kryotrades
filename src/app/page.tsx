'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const features = [
  {
    title: 'Real-Time Tracking',
    description: 'Sub-second balance updates with direct RPC connection',
    icon: '⚡'
  },
  {
    title: 'PnL Analytics',
    description: 'Advanced profit/loss tracking with daily baselines',
    icon: '📈'
  },
  {
    title: 'Multi-Wallet Support',
    description: 'Track multiple wallets simultaneously',
    icon: '👛'
  },
  {
    title: 'Privacy Focused',
    description: 'No data storage, direct blockchain queries',
    icon: '🔒'
  }
];

const socials = [
  {
    name: 'NubsCarson.com',
    url: 'https://nubscarson.com',
    icon: '🌐'
  },
  {
    name: '@monerosolana',
    url: 'https://x.com/monerosolana',
    icon: '𝕏'
  }
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between py-10">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container flex flex-col items-center space-y-8 text-center"
        >
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="gradient-text">Solana PnL Tracker</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
              High-performance wallet balance and PnL tracking
            </p>
          </div>
          <div className="space-x-4">
            <Link
              href="/kryo"
              className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Track kryo
            </Link>
            <Link
              href="/krimz"
              className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Track krimz
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              <span className="gradient-text">Advanced Features</span>
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground">
              Powerful tools for tracking your Solana portfolio
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="gradient-border group"
              >
                <div className="relative h-full rounded-lg bg-card p-6">
                  <div className="mb-4 text-4xl group-hover:animate-float">
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t py-6">
        <div className="container flex flex-col items-center gap-4">
          <div className="flex flex-wrap justify-center gap-4">
            {socials.map((social) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center justify-center rounded-md border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
              >
                <span className="mr-2">{social.icon}</span>
                {social.name}
              </motion.a>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Built with 🖤 by NubsCarson
          </p>
        </div>
      </footer>
    </div>
  );
}
