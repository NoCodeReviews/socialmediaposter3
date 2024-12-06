'use client';

import { BaseIcon } from './base-icon';
import { Post, WindowPosition } from '@/lib/types';
import { ICONS } from '@/lib/constants';

interface PostIconProps {
  post: Post;
  onClick: () => void;
  onPositionChange: (id: string, position: WindowPosition) => void;
  selected?: boolean;
}

export function PostIcon({ post, onClick, onPositionChange, selected }: PostIconProps) {
  const label = post.content.length > 30 
    ? post.content.slice(0, 27) + '...'
    : post.content;

  return (
    <BaseIcon
      id={post.id}
      src={ICONS.NOTEPAD}
      label={label}
      onClick={onClick}
      position={post.position}
      onPositionChange={(position) => onPositionChange(post.id, position)}
      selected={selected}
      draggable
    />
  );
}