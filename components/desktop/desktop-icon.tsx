'use client';

import { useState, useRef, useEffect } from 'react';
import { WindowPosition } from '@/lib/types';
import { snapToGrid } from '@/lib/grid';
import Image from 'next/image';

interface DesktopIconProps {
  id?: string;
  iconSrc: string;
  label: string;
  onClick: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  position?: WindowPosition;
  onPositionChange?: (position: WindowPosition) => void;
  selected?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  draggable?: boolean;
}

export function DesktopIcon({
  id,
  iconSrc,
  label,
  onClick,
  onContextMenu,
  position,
  onPositionChange,
  selected,
  onDragStart,
  onDragOver,
  onDrop,
  draggable,
}: DesktopIconProps) {
  const [isDragging, setIsDragging] = useState(false);
  const iconRef = useRef<HTMLDivElement>(null);
  const dragStartPosRef = useRef({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState(position || { x: 0, y: 0 });

  useEffect(() => {
    if (position) {
      setCurrentPosition(position);
    }
  }, [position]);

  const handleDragStart = (e: React.DragEvent) => {
    if (!iconRef.current) return;
    
    const rect = iconRef.current.getBoundingClientRect();
    dragStartPosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id || '');
    
    setIsDragging(true);
    if (onDragStart) onDragStart(e);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (onPositionChange) {
      const newX = e.clientX - dragStartPosRef.current.x;
      const newY = e.clientY - dragStartPosRef.current.y;
      const snappedPosition = snapToGrid(newX, newY);
      onPositionChange(snappedPosition);
    }
  };

  const handleIconContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onContextMenu) {
      onContextMenu(e);
    }
  };

  return (
    <div
      ref={iconRef}
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onContextMenu={handleIconContextMenu}
      className={`desktop-icon ${selected ? 'selected' : ''}`}
      style={{
        left: currentPosition.x,
        top: currentPosition.y,
        opacity: isDragging ? 0.5 : 1,
      }}
      data-icon-id={id}
    >
      <div className="desktop-icon-img">
        <img 
          src={iconSrc} 
          alt={label}
          draggable={false}
          className="pointer-events-none"
        />
      </div>
      <div className="desktop-icon-text">
        {label}
      </div>
    </div>
  );
}