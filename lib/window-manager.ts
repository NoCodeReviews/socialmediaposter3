import { WindowPosition } from './types';

const DEFAULT_WINDOW_CONFIG = {
  minWidth: 400,
  minHeight: 300,
  padding: 8,
  titleBarHeight: 24,
  defaultSpacing: 20,
};

export class WindowManager {
  private static instance: WindowManager;
  private openWindows: Map<string, WindowPosition>;
  private cascadeOffset: number;

  private constructor() {
    this.openWindows = new Map();
    this.cascadeOffset = 0;
  }

  static getInstance(): WindowManager {
    if (!WindowManager.instance) {
      WindowManager.instance = new WindowManager();
    }
    return WindowManager.instance;
  }

  getInitialPosition(windowId: string, width: number, height: number): WindowPosition {
    // Reset cascade if too far right or bottom
    if (this.cascadeOffset > 200) {
      this.cascadeOffset = 0;
    }

    const position = {
      x: DEFAULT_WINDOW_CONFIG.defaultSpacing + this.cascadeOffset,
      y: DEFAULT_WINDOW_CONFIG.defaultSpacing + this.cascadeOffset
    };

    // Ensure window is within viewport
    const maxX = window.innerWidth - width - DEFAULT_WINDOW_CONFIG.defaultSpacing;
    const maxY = window.innerHeight - height - DEFAULT_WINDOW_CONFIG.defaultSpacing;

    position.x = Math.min(position.x, maxX);
    position.y = Math.min(position.y, maxY);

    this.openWindows.set(windowId, position);
    this.cascadeOffset += 20;

    return position;
  }

  calculateOptimalSize(content: HTMLElement): { width: number; height: number } {
    const contentWidth = content.scrollWidth + (DEFAULT_WINDOW_CONFIG.padding * 2);
    const contentHeight = content.scrollHeight + DEFAULT_WINDOW_CONFIG.titleBarHeight + (DEFAULT_WINDOW_CONFIG.padding * 2);

    return {
      width: Math.max(contentWidth, DEFAULT_WINDOW_CONFIG.minWidth),
      height: Math.max(contentHeight, DEFAULT_WINDOW_CONFIG.minHeight)
    };
  }

  closeWindow(windowId: string): void {
    this.openWindows.delete(windowId);
  }

  updatePosition(windowId: string, position: WindowPosition): void {
    this.openWindows.set(windowId, position);
  }
}