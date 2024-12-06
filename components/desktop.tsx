'use client';

import { useEffect, useState } from 'react';
import { Window } from './desktop/window';
import { PostForm } from './post-form';
import { TrashBin } from './desktop/trash-bin';
import { Taskbar } from './desktop/taskbar';
import { StartMenu } from './desktop/start-menu';
import { ContextMenu } from './desktop/context-menu';
import { SystemIcon } from './desktop/system-icon';
import { PostIcon } from './desktop/post-icon';
import { FolderIcon } from './desktop/folder-icon';
import { FolderWindow } from './desktop/folder-window';
import { FolderForm } from './desktop/folder-form';
import { PostDetail } from './desktop/post-detail';
import { DesktopLayout } from './desktop/layout/desktop-layout';
import { useDesktopState } from '@/lib/hooks/useDesktopState';
import { usePostState } from '@/lib/hooks/usePostState';
import { useIconSelection } from '@/lib/hooks/useIconSelection';
import { ICONS, INITIAL_POSITIONS } from '@/lib/constants';
import { WindowPosition } from '@/lib/types';

export function Desktop() {
  const [showFolderForm, setShowFolderForm] = useState(false);
  const {
    state: desktopState,
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
  } = useDesktopState();

  const {
    posts,
    activePost,
    refreshKey,
    setActivePost,
    setRefreshKey,
    handlePostMove,
    handlePostDelete,
    handleFolderDrop,
  } = usePostState();

  const {
    selectedIconId,
    clearSelection,
    selectIcon,
  } = useIconSelection();

  useEffect(() => {
    const handleGlobalClick = () => {
      closeStartMenu();
      setContextMenuPosition(undefined);
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [closeStartMenu, setContextMenuPosition]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
  };

  const handleNewFolder = (name: string) => {
    addFolder({
      id: Date.now().toString(),
      name,
      position: { x: 100, y: 100 },
    });
  };

  // Filter posts to only show those not in folders and not deleted
  const desktopPosts = posts.filter(post => !post.folderId && !post.deleted);

  const openWindows = [
    ...(desktopState.postPlannerOpen ? ['Post Planner'] : []),
    ...(desktopState.trashOpen ? ['Recycle Bin'] : []),
    ...(activePost ? [activePost.content.slice(0, 20) + '...'] : []),
  ];

  return (
    <DesktopLayout
      onBackgroundClick={() => {
        clearSelection();
        setContextMenuPosition(undefined);
      }}
      onContextMenu={handleContextMenu}
    >
      {/* System Icons */}
      <SystemIcon
        src={ICONS.POST_PLANNER}
        label="Post Planner"
        onClick={openPostPlanner}
        position={INITIAL_POSITIONS.POST_PLANNER}
      />

      <SystemIcon
        src={ICONS.RECYCLE_BIN}
        label="Recycle Bin"
        onClick={openTrash}
        position={INITIAL_POSITIONS.RECYCLE_BIN}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const postId = e.dataTransfer.getData('text/plain');
          if (postId) handlePostDelete(postId);
        }}
      />

      {/* Post Icons */}
      {desktopPosts.map((post) => (
        <PostIcon
          key={post.id}
          post={post}
          onClick={() => setActivePost(post)}
          onPositionChange={handlePostMove}
          selected={selectedIconId === post.id}
        />
      ))}

      {/* Folder Icons */}
      {desktopState.folders.map((folder) => (
        <FolderIcon
          key={folder.id}
          id={folder.id}
          name={folder.name}
          onClick={() => openFolder(folder.id)}
          position={folder.position}
          isOpen={folder.id === desktopState.openFolderId}
          onDrop={(postId) => handleFolderDrop(folder.id, postId)}
        />
      ))}

      {/* Windows */}
      {desktopState.postPlannerOpen && (
        <Window
          id="post-planner"
          title="Post Planner"
          onClose={closePostPlanner}
          minWidth={500}
        >
          <PostForm
            onPostCreated={() => setRefreshKey(prev => prev + 1)}
            existingPositions={posts.map(p => p.position as WindowPosition).filter(Boolean)}
          />
        </Window>
      )}

      {desktopState.trashOpen && (
        <Window
          id="recycle-bin"
          title="Recycle Bin"
          onClose={closeTrash}
          minWidth={600}
        >
          <TrashBin />
        </Window>
      )}

      {activePost && (
        <Window
          id={`post-${activePost.id}`}
          title={activePost.content.slice(0, 30) + '...'}
          onClose={() => setActivePost(null)}
        >
          <PostDetail post={activePost} />
        </Window>
      )}

      {desktopState.openFolderId && (
        <Window
          id={`folder-${desktopState.openFolderId}`}
          title={desktopState.folders.find(f => f.id === desktopState.openFolderId)?.name || 'Folder'}
          onClose={closeFolder}
          minWidth={600}
        >
          <FolderWindow
            name={desktopState.folders.find(f => f.id === desktopState.openFolderId)?.name || 'Folder'}
            posts={posts.filter(p => p.folderId === desktopState.openFolderId)}
            onClose={closeFolder}
            onPostClick={setActivePost}
            onPostMove={(postId) => handleFolderDrop(desktopState.openFolderId!, postId)}
          />
        </Window>
      )}

      {/* Context Menu */}
      {desktopState.contextMenuPosition && (
        <ContextMenu
          position={desktopState.contextMenuPosition}
          onClose={() => setContextMenuPosition(undefined)}
          onNewPost={openPostPlanner}
          onNewFolder={() => {
            setContextMenuPosition(undefined);
            setShowFolderForm(true);
          }}
        />
      )}

      {/* Folder Creation Modal */}
      {showFolderForm && (
        <FolderForm
          onSubmit={handleNewFolder}
          onClose={() => setShowFolderForm(false)}
        />
      )}

      {/* Start Menu */}
      {desktopState.startMenuOpen && (
        <StartMenu
          onClose={closeStartMenu}
          onOpenPostPlanner={openPostPlanner}
        />
      )}

      {/* Taskbar */}
      <Taskbar
        openWindows={openWindows}
        onStartClick={toggleStartMenu}
        startMenuOpen={desktopState.startMenuOpen}
      />
    </DesktopLayout>
  );
}