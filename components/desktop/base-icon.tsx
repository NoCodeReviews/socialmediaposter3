'use client';

import { useRef, useState, useEffect } from 'react';
import { WindowPosition } from '@/lib/types';
import { snapToGrid } from '@/lib/grid';
import { DESKTOP_CONSTANTS } from '@/lib/constants';

interface BaseIconProps {
  id?: string;
  src: string;
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

export function BaseIcon({
  id,
  src,
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
}: BaseIconProps) {
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
    
    // Create a drag image
    const dragImage = iconRef.current.cloneNode(true) as HTMLElement;
    dragImage.style.opacity = '0.5';
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, dragStartPosRef.current.x, dragStartPosRef.current.y);
    setTimeout(() => document.body.removeChild(dragImage), 0);
    
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
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onContextMenu) onContextMenu(e);
      }}
      className={`desktop-icon ${selected ? 'selected' : ''}`}
      style={{
        left: currentPosition.x,
        top: currentPosition.y,
        opacity: isDragging ? 0.5 : 1,
        width: DESKTOP_CONSTANTS.GRID_SIZE,
        height: DESKTOP_CONSTANTS.GRID_SIZE,
      }}
      data-icon-id={id}
    >
      <div className="desktop-icon-img">
        <img
          src={src}
          alt={label}
          width={DESKTOP_CONSTANTS.ICON_SIZE}
          height={DESKTOP_CONSTANTS.ICON_SIZE}
          draggable={false}
          className="pointer-events-none"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
      <div className="desktop-icon-text">
        {label}
      </div>
    </div>
  );
}