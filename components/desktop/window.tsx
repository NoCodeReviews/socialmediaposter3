'use client';

import { useState, useRef, useEffect } from 'react';
import { WindowState } from '@/lib/types';
import { WindowManager } from '@/lib/window-manager';

interface WindowProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  id: string;
  minWidth?: number;
  minHeight?: number;
}

export function Window({
  title,
  onClose,
  children,
  id,
  minWidth = 400,
  minHeight = 300,
}: WindowProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const windowManager = WindowManager.getInstance();
  const [isMaximized, setIsMaximized] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const [preMaximizeState, setPreMaximizeState] = useState<WindowState & { width: number; height: number } | null>(null);
  
  const [windowState, setWindowState] = useState<WindowState & { 
    width: number;
    height: number;
    isMoving: boolean;
  }>({
    x: 0,
    y: 0,
    width: minWidth,
    height: minHeight,
    isMoving: false,
  });

  useEffect(() => {
    if (contentRef.current) {
      const { width, height } = windowManager.calculateOptimalSize(contentRef.current);
      const position = windowManager.getInitialPosition(id, width, height);
      
      setWindowState(prev => ({
        ...prev,
        x: position.x,
        y: position.y,
        width: Math.max(width + 32, minWidth), // Add padding for scrollbars
        height: Math.max(height, minHeight),
      }));
    }

    return () => windowManager.closeWindow(id);
  }, [id, minWidth, minHeight]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    
    const startX = e.clientX - windowState.x;
    const startY = e.clientY - windowState.y;

    const handleMouseMove = (e: MouseEvent) => {
      const newPosition = {
        x: Math.max(0, Math.min(e.clientX - startX, window.innerWidth - windowState.width)),
        y: Math.max(0, Math.min(e.clientY - startY, window.innerHeight - windowState.height))
      };

      setWindowState(prev => ({
        ...prev,
        ...newPosition,
        isMoving: true,
      }));
      
      windowManager.updatePosition(id, newPosition);
    };

    const handleMouseUp = () => {
      setWindowState(prev => ({ ...prev, isMoving: false }));
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    if (isMaximized) return;

    setIsResizing(true);
    setResizeDirection(direction);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = windowState.width;
    const startHeight = windowState.height;
    const startLeft = windowState.x;
    const startTop = windowState.y;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startLeft;
      let newY = startTop;

      if (direction.includes('e')) {
        newWidth = Math.max(minWidth, startWidth + deltaX);
      }
      if (direction.includes('s')) {
        newHeight = Math.max(minHeight, startHeight + deltaY);
      }
      if (direction.includes('w')) {
        const potentialWidth = Math.max(minWidth, startWidth - deltaX);
        if (potentialWidth !== startWidth) {
          newWidth = potentialWidth;
          newX = startLeft + (startWidth - potentialWidth);
        }
      }
      if (direction.includes('n')) {
        const potentialHeight = Math.max(minHeight, startHeight - deltaY);
        if (potentialHeight !== startHeight) {
          newHeight = potentialHeight;
          newY = startTop + (startHeight - potentialHeight);
        }
      }

      // Ensure window stays within screen bounds
      if (newX < 0) {
        newWidth += newX;
        newX = 0;
      }
      if (newY < 0) {
        newHeight += newY;
        newY = 0;
      }
      if (newX + newWidth > window.innerWidth) {
        newWidth = window.innerWidth - newX;
      }
      if (newY + newHeight > window.innerHeight) {
        newHeight = window.innerHeight - newY;
      }

      setWindowState(prev => ({
        ...prev,
        width: newWidth,
        height: newHeight,
        x: newX,
        y: newY,
      }));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeDirection(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const toggleMaximize = () => {
    if (isMaximized) {
      if (preMaximizeState) {
        setWindowState(preMaximizeState);
      }
    } else {
      setPreMaximizeState(windowState);
      setWindowState({
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight - 28,
        isMoving: false,
      });
    }
    setIsMaximized(!isMaximized);
  };

  return (
    <div
      className="absolute pointer-events-auto"
      style={{
        left: windowState.x,
        top: windowState.y,
        width: windowState.width,
        height: windowState.height,
        cursor: isResizing ? 
          resizeDirection === 'e' || resizeDirection === 'w' ? 'ew-resize' :
          resizeDirection === 'n' || resizeDirection === 's' ? 'ns-resize' :
          resizeDirection === 'nw' || resizeDirection === 'se' ? 'nwse-resize' :
          'nesw-resize' : 'default'
      }}
    >
      <div className="win95-shadow bg-[#c0c0c0] h-full flex flex-col relative">
        {/* Resize handles */}
        {!isMaximized && (
          <>
            <div
              className="absolute top-0 left-0 w-2 h-2 cursor-nw-resize z-50"
              onMouseDown={(e) => handleResizeStart(e, 'nw')}
            />
            <div
              className="absolute top-0 right-0 w-2 h-2 cursor-ne-resize z-50"
              onMouseDown={(e) => handleResizeStart(e, 'ne')}
            />
            <div
              className="absolute bottom-0 left-0 w-2 h-2 cursor-sw-resize z-50"
              onMouseDown={(e) => handleResizeStart(e, 'sw')}
            />
            <div
              className="absolute bottom-0 right-0 w-2 h-2 cursor-se-resize z-50"
              onMouseDown={(e) => handleResizeStart(e, 'se')}
            />
            <div
              className="absolute top-0 left-2 right-2 h-2 cursor-ns-resize z-50"
              onMouseDown={(e) => handleResizeStart(e, 'n')}
            />
            <div
              className="absolute bottom-0 left-2 right-2 h-2 cursor-ns-resize z-50"
              onMouseDown={(e) => handleResizeStart(e, 's')}
            />
            <div
              className="absolute left-0 top-2 bottom-2 w-2 cursor-ew-resize z-50"
              onMouseDown={(e) => handleResizeStart(e, 'w')}
            />
            <div
              className="absolute right-0 top-2 bottom-2 w-2 cursor-ew-resize z-50"
              onMouseDown={(e) => handleResizeStart(e, 'e')}
            />
          </>
        )}

        <div 
          className="win95-header h-[24px] px-[3px]"
          onMouseDown={handleMouseDown}
          style={{ cursor: isMaximized ? 'default' : 'move' }}
        >
          <span className="win95-header-title">{title}</span>
          <div className="win95-header-buttons">
            <button
              onClick={toggleMaximize}
              className="win95-header-button"
            >
              {isMaximized ? '❐' : '□'}
            </button>
            <button
              onClick={onClose}
              className="win95-header-button"
            >
              ×
            </button>
          </div>
        </div>
        <div 
          ref={contentRef}
          className="flex-1 p-4 overflow-auto"
        >
          {children}
        </div>
      </div>
    </div>
  );
}