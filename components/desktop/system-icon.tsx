'use client';

import { BaseIcon } from './base-icon';
import { WindowPosition } from '@/lib/types';

interface SystemIconProps {
  id?: string;
  src: string;
  label: string;
  onClick: () => void;
  position: WindowPosition;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}

export function SystemIcon({
  id,
  src,
  label,
  onClick,
  position,
  onDragOver,
  onDrop,
}: SystemIconProps) {
  return (
    <BaseIcon
      id={id}
      src={src}
      label={label}
      onClick={onClick}
      position={position}
      onDragOver={onDragOver}
      onDrop={onDrop}
    />
  );
}