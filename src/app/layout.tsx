import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/ui/header";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Solana PnL Tracker",
  description: "High-performance Solana wallet balance and PnL tracking",
};

export const viewport: Viewport = {
  themeColor: "#16171B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isOBS = typeof window !== 'undefined' && window.location.pathname.startsWith('/obs');
  
  return (
    <html lang="en" className={`${inter.variable} dark`} suppressHydrationWarning>
      <body 
        className={isOBS ? undefined : "min-h-screen font-sans antialiased"}
        style={isOBS ? { background: 'transparent' } : { background: '#16171B' }}
      >
        <div className={isOBS ? undefined : "relative flex min-h-screen flex-col"}>
          {!isOBS && <Header />}
          <div className={isOBS ? undefined : "flex-1"}>
            <div className={isOBS ? undefined : "container py-6"}>
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
