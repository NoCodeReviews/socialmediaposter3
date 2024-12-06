import { Post, WindowPosition } from './types';
import { getNextAvailablePosition } from './grid';

export function getPosts(): Post[] {
  if (typeof window === 'undefined') return [];
  const posts = localStorage.getItem('posts');
  return posts ? JSON.parse(posts) : [];
}

export function savePost(post: Omit<Post, 'id'>, existingPositions: WindowPosition[] = []): void {
  const posts = getPosts();
  const newPosition = getNextAvailablePosition(existingPositions);
  
  const newPost: Post = {
    ...post,
    id: Date.now().toString(),
    position: newPosition,
    folderId: null,
    deleted: false,
  };
  
  posts.push(newPost);
  localStorage.setItem('posts', JSON.stringify(posts));
}

export function updatePostPosition(id: string, position: WindowPosition): void {
  const posts = getPosts();
  const updatedPosts = posts.map(post =>
    post.id === id ? { ...post, position } : post
  );
  localStorage.setItem('posts', JSON.stringify(updatedPosts));
}

export function movePostToFolder(postId: string, folderId: string | null): void {
  const posts = getPosts();
  const updatedPosts = posts.map(post =>
    post.id === postId ? { ...post, folderId } : post
  );
  localStorage.setItem('posts', JSON.stringify(updatedPosts));
}

export function deletePost(id: string): void {
  const posts = getPosts();
  const updatedPosts = posts.map(post =>
    post.id === id ? { ...post, deleted: true, folderId: null } : post
  );
  localStorage.setItem('posts', JSON.stringify(updatedPosts));
}

export function restorePost(id: string): void {
  const posts = getPosts();
  const updatedPosts = posts.map(post =>
    post.id === id ? { ...post, deleted: false } : post
  );
  localStorage.setItem('posts', JSON.stringify(updatedPosts));
}

export function permanentlyDeletePost(id: string): void {
  const posts = getPosts();
  const updatedPosts = posts.filter(post => post.id !== id);
  localStorage.setItem('posts', JSON.stringify(updatedPosts));
}