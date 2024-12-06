'use client';

import { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { Post } from '@/lib/types';
import { getPosts, restorePost, permanentlyDeletePost } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

export function TrashBin() {
  const [deletedPosts, setDeletedPosts] = useState<Post[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'icons'>('list');
  const { toast } = useToast();

  useEffect(() => {
    setDeletedPosts(getPosts().filter(post => post.deleted));
  }, []);

  const handleRestore = (id: string) => {
    restorePost(id);
    setDeletedPosts(deletedPosts.filter(post => post.id !== id));
    toast({
      title: 'Post restored',
      description: 'The post has been restored to your schedule',
    });
  };

  const handlePermanentDelete = (id: string) => {
    permanentlyDeletePost(id);
    setDeletedPosts(deletedPosts.filter(post => post.id !== id));
    toast({
      title: 'Post permanently deleted',
      description: 'The post has been permanently removed',
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 bg-[#c0c0c0] win95-shadow p-2">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`px-2 py-1 ${
              viewMode === 'list' ? 'win95-inset' : 'win95-shadow'
            }`}
          >
            List
          </button>
          <button
            onClick={() => setViewMode('icons')}
            className={`px-2 py-1 ${
              viewMode === 'icons' ? 'win95-inset' : 'win95-shadow'
            }`}
          >
            Icons
          </button>
        </div>
      </div>

      {deletedPosts.length === 0 ? (
        <div className="flex-1 flex items-center justify-center bg-white win95-inset p-4">
          <span className="text-gray-500">Recycle Bin is empty</span>
        </div>
      ) : viewMode === 'list' ? (
        <div className="flex-1 bg-white win95-inset p-2 overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-[#c0c0c0] win95-shadow">
              <tr>
                <th className="text-left p-2">Content</th>
                <th className="text-left p-2 w-48">Scheduled Date</th>
                <th className="w-32 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deletedPosts.map((post) => (
                <tr key={post.id} className="border-b border-gray-200">
                  <td className="p-2">
                    <div className="truncate max-w-xs">{post.content}</div>
                  </td>
                  <td className="p-2 text-sm">
                    {new Date(post.scheduledDate).toLocaleString()}
                  </td>
                  <td className="p-2">
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleRestore(post.id)}
                        className="px-2 py-1 text-sm win95-shadow hover:win95-inset"
                      >
                        Restore
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(post.id)}
                        className="px-2 py-1 text-sm win95-shadow hover:win95-inset"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex-1 bg-white win95-inset p-4 overflow-auto">
          <div className="grid grid-cols-4 gap-4">
            {deletedPosts.map((post) => (
              <div
                key={post.id}
                className="flex flex-col items-center gap-2 p-2 hover:bg-[#000080] hover:text-white"
              >
                <div className="w-12 h-12 bg-[#c0c0c0] win95-shadow p-2 flex items-center justify-center">
                  <FileText className="w-8 h-8" />
                </div>
                <div className="text-center text-xs">
                  <div className="truncate w-20">{post.content}</div>
                </div>
                <div className="flex gap-1 mt-2">
                  <button
                    onClick={() => handleRestore(post.id)}
                    className="px-2 py-1 text-xs win95-shadow hover:win95-inset"
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => handlePermanentDelete(post.id)}
                    className="px-2 py-1 text-xs win95-shadow hover:win95-inset"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}