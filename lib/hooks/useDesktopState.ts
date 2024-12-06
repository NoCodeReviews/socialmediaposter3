'use client';

import { useState, useCallback } from 'react';
import { DesktopState, WindowPosition, Folder } from '@/lib/types';
import { getNextAvailablePosition } from '@/lib/grid';

const initialState: DesktopState = {
  postPlannerOpen: false,
  trashOpen: false,
  startMenuOpen: false,
  folders: [],
  openFolderId: null,
};

export function useDesktopState() {
  const [state, setState] = useState<DesktopState>(initialState);

  const openPostPlanner = () => setState(prev => ({ ...prev, postPlannerOpen: true }));
  const closePostPlanner = () => setState(prev => ({ ...prev, postPlannerOpen: false }));
  
  const openTrash = () => setState(prev => ({ ...prev, trashOpen: true }));
  const closeTrash = () => setState(prev => ({ ...prev, trashOpen: false }));
  
  const toggleStartMenu = () => setState(prev => ({ ...prev, startMenuOpen: !prev.startMenuOpen }));
  const closeStartMenu = () => setState(prev => ({ ...prev, startMenuOpen: false }));
  
  const setContextMenuPosition = (position?: WindowPosition) => 
    setState(prev => ({ ...prev, contextMenuPosition: position }));

  const addFolder = useCallback((folder: Omit<Folder, 'position'>) => {
    setState(prev => {
      const existingPositions = prev.folders.map(f => f.position);
      const newPosition = getNextAvailablePosition(existingPositions);
      
      return {
        ...prev,
        folders: [
          ...prev.folders,
          {
            ...folder,
            position: newPosition,
          },
        ],
      };
    });
  }, []);

  const openFolder = (folderId: string) => 
    setState(prev => ({ ...prev, openFolderId: folderId }));

  const closeFolder = () => 
    setState(prev => ({ ...prev, openFolderId: null }));

  const updateFolderPosition = (folderId: string, position: WindowPosition) =>
    setState(prev => ({
      ...prev,
      folders: prev.folders.map(folder =>
        folder.id === folderId ? { ...folder, position } : folder
      ),
    }));

  return {
    state,
    openPostPlanner,
    closePostPlanner,
    openTrash,
    closeTrash,
    toggleStartMenu,
    closeStartMenu,
    setContextMenuPosition,
    addFolder,
    openFolder,
    closeFolder,
    updateFolderPosition,
  };
}