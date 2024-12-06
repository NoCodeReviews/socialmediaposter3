export const DESKTOP_CONSTANTS = {
  GRID_SIZE: 80,  // Increased from 64
  ICON_SIZE: 32,
  MARGIN: 8,
  TASKBAR_HEIGHT: 28,
};

export const ICONS = {
  POST_PLANNER: 'https://win98icons.alexmeub.com/icons/png/write_file-0.png',
  RECYCLE_BIN: 'https://win98icons.alexmeub.com/icons/png/recycle_bin_empty-0.png',
  FOLDER: 'https://win98icons.alexmeub.com/icons/png/directory_closed-0.png',
  FOLDER_OPEN: 'https://win98icons.alexmeub.com/icons/png/directory_open-0.png',
  NOTEPAD: 'https://win98icons.alexmeub.com/icons/png/notepad-0.png',
} as const;

export const INITIAL_POSITIONS = {
  RECYCLE_BIN: { x: 4, y: 4 },
  POST_PLANNER: { x: 4, y: DESKTOP_CONSTANTS.GRID_SIZE + 12 },
} as const;