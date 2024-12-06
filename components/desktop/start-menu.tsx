'use client';

import { useState } from 'react';
import { ICONS } from '@/lib/constants';

interface StartMenuProps {
  onClose: () => void;
  onOpenPostPlanner: () => void;
  onOpenNotepad?: () => void;
}

export function StartMenu({ onClose, onOpenPostPlanner, onOpenNotepad }: StartMenuProps) {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  const handleMouseEnter = (menu: string) => {
    setActiveSubmenu(menu);
  };

  const handleMouseLeave = () => {
    setActiveSubmenu(null);
  };

  const handleItemClick = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <div 
      className="fixed bottom-12 left-0 z-50"
      onMouseLeave={handleMouseLeave}
    >
      {/* Main menu */}
      <div className="bg-[#c0c0c0] win95-shadow min-w-[180px] py-1">
        <div className="bg-[#808080] h-full w-[20px] absolute left-0 top-0 flex items-center justify-center">
          <span className="text-white font-bold transform -rotate-90 whitespace-nowrap">Post Planner 95</span>
        </div>
        
        {/* Menu items with padding for the vertical text */}
        <div className="pl-[25px]">
          <div className="relative">
            <button 
              className="w-full px-4 py-1 text-left hover:bg-[#000080] hover:text-white flex items-center gap-2"
              onMouseEnter={() => handleMouseEnter('programs')}
            >
              <img src={ICONS.POST_PLANNER} alt="" className="w-4 h-4" style={{ imageRendering: 'pixelated' }} />
              <span>Programs</span>
              <span className="ml-auto">▶</span>

              {activeSubmenu === 'programs' && (
                <div className="absolute left-full top-0 bg-[#c0c0c0] win95-shadow min-w-[180px] py-1">
                  <button 
                    onClick={() => handleItemClick(onOpenPostPlanner)}
                    className="w-full px-4 py-1 text-left hover:bg-[#000080] hover:text-white flex items-center gap-2"
                  >
                    <img src={ICONS.POST_PLANNER} alt="" className="w-4 h-4" style={{ imageRendering: 'pixelated' }} />
                    <span>Post Planner</span>
                  </button>
                  {onOpenNotepad && (
                    <button 
                      onClick={() => handleItemClick(onOpenNotepad)}
                      className="w-full px-4 py-1 text-left hover:bg-[#000080] hover:text-white flex items-center gap-2"
                    >
                      <img src={ICONS.NOTEPAD} alt="" className="w-4 h-4" style={{ imageRendering: 'pixelated' }} />
                      <span>Notepad</span>
                    </button>
                  )}
                </div>
              )}
            </button>
          </div>
          
          <div className="relative">
            <button 
              className="w-full px-4 py-1 text-left hover:bg-[#000080] hover:text-white flex items-center gap-2"
              onMouseEnter={() => handleMouseEnter('documents')}
            >
              <img src={ICONS.FOLDER} alt="" className="w-4 h-4" style={{ imageRendering: 'pixelated' }} />
              <span>Documents</span>
              <span className="ml-auto">▶</span>

              {activeSubmenu === 'documents' && (
                <div className="absolute left-full top-0 bg-[#c0c0c0] win95-shadow min-w-[180px] py-1">
                  <button className="w-full px-4 py-1 text-left hover:bg-[#000080] hover:text-white flex items-center gap-2">
                    <img src={ICONS.FOLDER} alt="" className="w-4 h-4" style={{ imageRendering: 'pixelated' }} />
                    <span>My Documents</span>
                  </button>
                  <button className="w-full px-4 py-1 text-left hover:bg-[#000080] hover:text-white flex items-center gap-2">
                    <img src={ICONS.FOLDER} alt="" className="w-4 h-4" style={{ imageRendering: 'pixelated' }} />
                    <span>Recent Posts</span>
                  </button>
                </div>
              )}
            </button>
          </div>
          
          <div className="relative">
            <button 
              className="w-full px-4 py-1 text-left hover:bg-[#000080] hover:text-white flex items-center gap-2"
              onMouseEnter={() => handleMouseEnter('settings')}
            >
              <img src={ICONS.POST_PLANNER} alt="" className="w-4 h-4" style={{ imageRendering: 'pixelated' }} />
              <span>Settings</span>
              <span className="ml-auto">▶</span>

              {activeSubmenu === 'settings' && (
                <div className="absolute left-full top-0 bg-[#c0c0c0] win95-shadow min-w-[180px] py-1">
                  <button className="w-full px-4 py-1 text-left hover:bg-[#000080] hover:text-white flex items-center gap-2">
                    <img src={ICONS.POST_PLANNER} alt="" className="w-4 h-4" style={{ imageRendering: 'pixelated' }} />
                    <span>Control Panel</span>
                  </button>
                  <button className="w-full px-4 py-1 text-left hover:bg-[#000080] hover:text-white flex items-center gap-2">
                    <img src={ICONS.POST_PLANNER} alt="" className="w-4 h-4" style={{ imageRendering: 'pixelated' }} />
                    <span>User Settings</span>
                  </button>
                </div>
              )}
            </button>
          </div>
          
          <div className="border-t border-[#808080] my-1" />
          
          <button
            onClick={onClose}
            className="w-full px-4 py-1 text-left hover:bg-[#000080] hover:text-white flex items-center gap-2"
          >
            <img src={ICONS.POST_PLANNER} alt="" className="w-4 h-4" style={{ imageRendering: 'pixelated' }} />
            <span>Shut Down...</span>
          </button>
        </div>
      </div>
    </div>
  );
}