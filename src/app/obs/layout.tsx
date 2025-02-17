'use client';

import "@/app/globals.css";

export default function OBSLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <style jsx global>{`
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          background: transparent !important;
        }

        #__next {
          background: transparent !important;
        }

        /* Remove the universal background override */
        .obs-card {
          background: #222 !important;
        }
      `}</style>
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
      }}>
        {children}
      </div>
    </>
  );
} 