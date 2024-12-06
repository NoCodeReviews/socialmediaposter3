'use client';

import { Post } from '@/lib/types';
import { format, isValid } from 'date-fns';

interface PostDetailProps {
  post: Post;
}

export function PostDetail({ post }: PostDetailProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (!isValid(date)) return 'Invalid date';
    return format(date, 'PPpp');
  };

  return (
    <div className="space-y-4 min-w-[400px]">
      <div className="win95-inset bg-white p-4">
        <pre className="whitespace-pre-wrap font-sans">{post.content}</pre>
      </div>
      <div className="text-sm">
        Scheduled for: {formatDate(post.scheduledDate)}
      </div>
    </div>
  );
}