'use client';

import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function OBSLayout({ children }: Props) {
  return (
    <>
      <style jsx global>{`
        body {
          background: transparent !important;
        }
      `}</style>
      {children}
    </>
  );
} 