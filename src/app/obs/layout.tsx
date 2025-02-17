import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Solana PnL Tracker - OBS Overlay",
  description: "OBS overlay for Solana wallet balance and PnL tracking",
};

export default function OBSLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-transparent">
      {children}
    </div>
  );
} 