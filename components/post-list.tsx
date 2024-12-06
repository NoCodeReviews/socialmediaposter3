'use client';

import { useEffect, useState } from 'react';
import { Post } from '@/lib/types';
import { getPosts, deletePost } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

export function PostList({ refresh }: { refresh: number }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setPosts(getPosts().sort((a, b) => 
      new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
    ));
  }, [refresh]);

  const handleDelete = (id: string) => {
    deletePost(id);
    setPosts(posts.filter(post => post.id !== id));
    toast({
      title: 'Post deleted',
      description: 'The post has been removed from your schedule',
    });
  };

  if (posts.length === 0) {
    return (
      <div className="bg-white win95-inset p-4 text-center text-gray-500">
        No posts scheduled yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="bg-white win95-inset p-4">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <p className="whitespace-pre-wrap">{post.content}</p>
              <p className="text-sm text-gray-600 mt-2">
                Scheduled for: {new Date(post.scheduledDate).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => handleDelete(post.id)}
              className="bg-[#c0c0c0] px-2 py-1 win95-shadow hover:win95-inset active:win95-inset"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}