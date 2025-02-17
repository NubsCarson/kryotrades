'use client';

import "@/app/globals.css";

export default function OBSLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div style={{ 
      background: 'transparent',
      backgroundColor: 'transparent',
      margin: 0,
      padding: 0,
    }}>
      <style jsx global>{`
        html, body {
          background: transparent !important;
          background-color: transparent !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden !important;
        }
        * {
          background: transparent !important;
        }
      `}</style>
      {children}
    </div>
  );
} 