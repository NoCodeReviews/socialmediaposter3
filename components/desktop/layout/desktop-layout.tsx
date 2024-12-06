'use client';

import { ReactNode } from 'react';
import { WindowPosition } from '@/lib/types';

interface DesktopLayoutProps {
  children: ReactNode;
  onBackgroundClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

export function DesktopLayout({
  children,
  onBackgroundClick,
  onContextMenu,
}: DesktopLayoutProps) {
  return (
    <div
      className="h-screen w-screen relative overflow-hidden"
      onClick={onBackgroundClick}
      onContextMenu={onContextMenu}
    >
      <div className="desktop-grid" />
      {children}
    </div>
  );
}