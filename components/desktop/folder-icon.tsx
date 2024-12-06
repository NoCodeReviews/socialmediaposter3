'use client';

import { BaseIcon } from './base-icon';
import { WindowPosition } from '@/lib/types';
import { ICONS } from '@/lib/constants';

interface FolderIconProps {
  id: string;
  name: string;
  onClick: () => void;
  position: WindowPosition;
  onPositionChange?: (position: WindowPosition) => void;
  selected?: boolean;
  isOpen?: boolean;
  onDrop: (postId: string) => void;
}

export function FolderIcon({
  id,
  name,
  onClick,
  position,
  onPositionChange,
  selected,
  isOpen,
  onDrop,
}: FolderIconProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const postId = e.dataTransfer.getData('text/plain');
    if (postId) {
      onDrop(postId);
    }
  };

  return (
    <BaseIcon
      id={id}
      src={isOpen ? ICONS.FOLDER_OPEN : ICONS.FOLDER}
      label={name}
      onClick={onClick}
      position={position}
      onPositionChange={onPositionChange}
      selected={selected}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    />
  );
}