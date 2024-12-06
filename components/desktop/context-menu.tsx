'use client';

import { WindowPosition } from '@/lib/types';

interface ContextMenuProps {
  position: WindowPosition;
  onClose: () => void;
  onNewPost: () => void;
  onNewFolder: () => void;
  onRename?: () => void;
  onDelete?: () => void;
  isIconMenu?: boolean;
}

export function ContextMenu({
  position,
  onClose,
  onNewPost,
  onNewFolder,
  onRename,
  onDelete,
  isIconMenu,
}: ContextMenuProps) {
  return (
    <div
      className="fixed z-50 bg-[#c0c0c0] win95-shadow min-w-[200px]"
      style={{ left: position.x, top: position.y }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="py-1">
        {isIconMenu ? (
          <>
            {onRename && (
              <button
                onClick={() => {
                  onRename();
                  onClose();
                }}
                className="w-full px-4 py-1 text-left hover:bg-[#000080] hover:text-white"
              >
                Rename
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => {
                  onDelete();
                  onClose();
                }}
                className="w-full px-4 py-1 text-left hover:bg-[#000080] hover:text-white"
              >
                Delete
              </button>
            )}
          </>
        ) : (
          <>
            <button
              onClick={() => {
                onNewPost();
                onClose();
              }}
              className="w-full px-4 py-1 text-left hover:bg-[#000080] hover:text-white"
            >
              New Post
            </button>
            <button
              onClick={() => {
                onNewFolder();
                onClose();
              }}
              className="w-full px-4 py-1 text-left hover:bg-[#000080] hover:text-white"
            >
              New Folder
            </button>
          </>
        )}
      </div>
    </div>
  );
}