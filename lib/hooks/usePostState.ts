'use client';

import { useState, useEffect } from 'react';
import { Post, WindowPosition } from '@/lib/types';
import { getPosts, updatePostPosition, movePostToFolder, deletePost } from '@/lib/storage';

export function usePostState() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activePost, setActivePost] = useState<Post | null>(null);

  useEffect(() => {
    const allPosts = getPosts();
    setPosts(allPosts.filter(post => !post.deleted));
  }, [refreshKey]);

  const handlePostMove = (id: string, position: WindowPosition) => {
    updatePostPosition(id, position);
    setPosts(prev =>
      prev.map(post =>
        post.id === id ? { ...post, position } : post
      )
    );
  };

  const handlePostDelete = (postId: string) => {
    deletePost(postId);
    setPosts(prev => prev.filter(p => p.id !== postId));
    setRefreshKey(prev => prev + 1);
  };

  const handleFolderDrop = (folderId: string, postId: string) => {
    movePostToFolder(postId, folderId);
    setPosts(prev =>
      prev.map(post =>
        post.id === postId ? { ...post, folderId } : post
      )
    );
  };

  return {
    posts,
    activePost,
    refreshKey,
    setActivePost,
    setRefreshKey,
    handlePostMove,
    handlePostDelete,
    handleFolderDrop,
  };
}