import { WindowPosition } from './types';
import { DESKTOP_CONSTANTS, INITIAL_POSITIONS } from './constants';

const GRID_CACHE = new Map<string, string>();

export function isPositionOccupied(x: number, y: number): boolean {
  return Array.from(GRID_CACHE.entries()).some(([pos]) => {
    const [posX, posY] = pos.split(',').map(Number);
    return posX === x && posY === y;
  });
}

export function addToGrid(position: WindowPosition, id?: string) {
  if (!position) return;
  GRID_CACHE.set(`${position.x},${position.y}`, id || 'occupied');
}

export function removeFromGrid(position: WindowPosition) {
  if (!position) return;
  GRID_CACHE.delete(`${position.x},${position.y}`);
}

export function clearGrid() {
  GRID_CACHE.clear();
}

export function snapToGrid(x: number, y: number): WindowPosition {
  const gridX = Math.round(x / DESKTOP_CONSTANTS.GRID_SIZE) * DESKTOP_CONSTANTS.GRID_SIZE;
  const gridY = Math.round(y / DESKTOP_CONSTANTS.GRID_SIZE) * DESKTOP_CONSTANTS.GRID_SIZE;
  
  const maxX = Math.floor((window.innerWidth - DESKTOP_CONSTANTS.GRID_SIZE) / DESKTOP_CONSTANTS.GRID_SIZE) * DESKTOP_CONSTANTS.GRID_SIZE;
  const maxY = Math.floor((window.innerHeight - DESKTOP_CONSTANTS.TASKBAR_HEIGHT - DESKTOP_CONSTANTS.GRID_SIZE) / DESKTOP_CONSTANTS.GRID_SIZE) * DESKTOP_CONSTANTS.GRID_SIZE;
  
  return {
    x: Math.max(4, Math.min(gridX, maxX)),
    y: Math.max(4, Math.min(gridY, maxY))
  };
}

export function getNextAvailablePosition(existingPositions: WindowPosition[] = []): WindowPosition {
  // Clear and rebuild grid cache
  clearGrid();
  
  // Add system positions first
  addToGrid(INITIAL_POSITIONS.RECYCLE_BIN);
  addToGrid(INITIAL_POSITIONS.POST_PLANNER);
  
  // Add existing positions to grid
  existingPositions.forEach(pos => {
    if (pos) addToGrid(pos);
  });

  // Start from top-left, moving right then down
  const startX = 4;
  const startY = 4;
  const cols = Math.floor((window.innerWidth - startX) / DESKTOP_CONSTANTS.GRID_SIZE);
  const rows = Math.floor((window.innerHeight - DESKTOP_CONSTANTS.TASKBAR_HEIGHT - startY) / DESKTOP_CONSTANTS.GRID_SIZE);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = startX + (col * DESKTOP_CONSTANTS.GRID_SIZE);
      const y = startY + (row * DESKTOP_CONSTANTS.GRID_SIZE);

      // Skip positions of system icons
      if ((x === INITIAL_POSITIONS.RECYCLE_BIN.x && y === INITIAL_POSITIONS.RECYCLE_BIN.y) ||
          (x === INITIAL_POSITIONS.POST_PLANNER.x && y === INITIAL_POSITIONS.POST_PLANNER.y)) {
        continue;
      }

      if (!isPositionOccupied(x, y)) {
        return { x, y };
      }
    }
  }

  // If no space found, return a position at the end
  return {
    x: startX + DESKTOP_CONSTANTS.GRID_SIZE,
    y: startY + DESKTOP_CONSTANTS.GRID_SIZE
  };
}