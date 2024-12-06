export interface Post {
  id: string;
  content: string;
  scheduledDate: string;
  deleted?: boolean;
  position?: {
    x: number;
    y: number;
  };
  folderId?: string;
}

export interface Folder {
  id: string;
  name: string;
  position: WindowPosition;
}

export interface DesktopState {
  postPlannerOpen: boolean;
  trashOpen: boolean;
  activePostId?: string;
  startMenuOpen: boolean;
  contextMenuPosition?: WindowPosition;
  folders: Folder[];
  openFolderId: string | null;
}

export interface WindowPosition {
  x: number;
  y: number;
}

export interface WindowState extends WindowPosition {
  isMoving: boolean;
}

export interface DesktopIconPosition {
  id: string;
  position: WindowPosition;
}