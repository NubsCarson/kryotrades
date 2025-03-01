'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { userData } from '@/config/users';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  BarChart3,
  Wallet,
  Shield,
  Zap,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';

const features = [
  {
    title: 'Real-Time PnL Tracking',
    description: 'Sub-second balance updates with direct RPC connection for live streaming',
    icon: <BarChart3 className="h-6 w-6" />,
    color: 'text-primary',
  },
  {
    title: 'Stream Overlay Ready',
    description: 'Beautifully designed overlays perfect for your live streams',
    icon: <Zap className="h-6 w-6" />,
    color: 'text-secondary',
  },
  {
    title: 'Multi-Wallet Support',
    description: 'Track multiple wallets simultaneously with real-time updates',
    icon: <Wallet className="h-6 w-6" />,
    color: 'text-accent',
  },
  {
    title: 'Privacy Focused',
    description: 'No data storage, direct blockchain queries for maximum security',
    icon: <Shield className="h-6 w-6" />,
    color: 'text-primary',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Video Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-black/50" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        >
          <source src="/loop.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Bottom Right Decorative Element */}
      <motion.div 
        className="fixed bottom-0 right-0 -z-5 h-[120px] w-[400px] translate-x-[-60px] translate-y-[0px]"
        whileHover={{ 
          y: -5,
          filter: "brightness(1.1)",
        }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <div className="absolute inset-0 bg-[#0f0f0f] rounded-[60px] border border-[#1a1a1a] transition-all duration-300 hover:border-[#262626] hover:shadow-[0_0_30px_rgba(0,0,0,0.3)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 blur-[60px] rounded-[60px]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <motion.p 
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
              className="font-bold text-white/90 text-lg px-6 drop-shadow-lg"
            >
              We gonna make it out these
              <motion.span 
                className="block font-black text-xl"
                initial={{ 
                  background: "linear-gradient(to right, #ff66cc, #aa66ff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundSize: "200% 100%",
                  backgroundPosition: "0% 50%"
                }}
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  scale: [1, 1.02, 1]
                }}
                transition={{ 
                  duration: 8,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut"
                }}
              >
                trenches
              </motion.span>
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <section className="container mt-24 space-y-8 pt-16 md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center space-y-8 text-center"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="relative">
              <motion.div
                animate={{ 
                  opacity: [0.5, 1, 0.5],
                  scale: [1, 1.02, 1],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="absolute -inset-x-20 -inset-y-10 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 blur-3xl rounded-full"
              />
              <h1 className="relative text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="gradient-text">
                  Professional Solana
                </span>
                <br />
                <span className="text-white">Stream Overlays</span>
              </h1>
            </div>
            <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
              Elevate your trading streams with real-time PnL tracking and beautiful overlays
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-wrap justify-center gap-4"
          >
            {Object.entries(userData)
              .filter(([, user]) => user.showOnHomepage !== false)
              .map(([username]) => (
              <motion.div
                key={username}
                variants={item}
                className="flex items-center space-x-2"
              >
                <Button 
                  size="lg" 
                  className="group relative overflow-hidden rounded-full bg-[#ff66cc] text-white transition-all hover:scale-105 hover:bg-[#ff4dc4] hover:shadow-[0_0_30px_rgba(255,105,180,0.3)]"
                  asChild
                >
                  <Link href={`/${username}`} className="flex items-center px-8">
                    Track {username}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="relative overflow-hidden rounded-full border-[#ff66cc] bg-[#0f0f0f] transition-all hover:scale-105 hover:border-[#ff66cc] hover:bg-[#1a1a1a] hover:shadow-[0_0_20px_rgba(255,105,180,0.2)]"
                  asChild
                >
                  <Link href={`/obs/${username}`} title="OBS Overlay">
                    <Zap className="h-4 w-4 text-primary" />
                    <span className="sr-only">OBS Overlay</span>
                  </Link>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container space-y-12 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-4 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl">
            Powerful Features for
            <br />
            <span className="gradient-text">
              Professional Streamers
            </span>
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="group h-full perspective-1000"
            >
              <motion.div
                whileHover={{ 
                  scale: 1.02,
                  rotateX: 2,
                  rotateY: 2,
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="relative h-full overflow-hidden rounded-3xl border-[#1a1a1a] bg-[#0f0f0f] p-8 transition-all duration-300 hover:border-[#262626] hover:shadow-[0_0_30px_rgba(0,0,0,0.3)]">
                  <div className="relative flex h-full flex-col space-y-4">
                    <div className="flex items-center space-x-4">
                      <motion.div 
                        className={`rounded-2xl bg-[#1a1a1a] p-3 ${feature.color}`}
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        {feature.icon}
                      </motion.div>
                      <h3 className="text-xl font-medium text-white">{feature.title}</h3>
                    </div>
                    <p className="text-[#a0a0a0]">{feature.description}</p>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/5 py-8 bg-background/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container"
        >
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="flex items-center space-x-4">
              <motion.a
                href="https://discord.gg/pumpdotfun"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-full bg-[#5865F2] p-3 transition-all duration-300 hover:bg-[#4752C4] hover:shadow-[0_0_20px_rgba(88,101,242,0.5)]"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#5865F2]/0 via-[#5865F2]/50 to-[#5865F2]/0 opacity-0 transition-opacity group-hover:animate-shine" />
                <MessageCircle className="h-5 w-5 text-white" />
              </motion.a>

              <motion.a
                href="https://twitter.com/monerosolana"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-full bg-black p-3 transition-all duration-300 hover:bg-[#111] hover:shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/0 via-white/5 to-black/0 opacity-0 transition-opacity group-hover:animate-shine" />
                <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </motion.a>

              <motion.a
                href="https://github.com/nubscarson"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-full bg-[#333] p-3 transition-all duration-300 hover:bg-[#444] hover:shadow-[0_0_20px_rgba(68,68,68,0.5)]"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#333]/0 via-[#fff]/5 to-[#333]/0 opacity-0 transition-opacity group-hover:animate-shine" />
                <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </motion.a>
            </div>

            <motion.p 
              className="text-sm text-[#a0a0a0] font-medium"
              whileHover={{ scale: 1.05 }}
            >
              Built with 🖤 by{' '}
              <a 
                href="https://nubscarson.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-primary transition-colors"
              >
                NubsCarson
              </a>
            </motion.p>
          </div>
        </motion.div>
      </footer>
    </div>
  );
}
