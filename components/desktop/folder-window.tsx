'use client';

import { useState } from 'react';
import { Post } from '@/lib/types';
import { format } from 'date-fns';
import { DESKTOP_CONSTANTS, ICONS } from '@/lib/constants';

interface FolderWindowProps {
  name: string;
  posts: Post[];
  onClose: () => void;
  onPostClick: (post: Post) => void;
  onPostMove: (postId: string) => void;
}

export function FolderWindow({ name, posts, onClose, onPostClick, onPostMove }: FolderWindowProps) {
  const [viewMode, setViewMode] = useState<'list' | 'icons'>('list');
  const [sortField, setSortField] = useState<'content' | 'scheduledDate'>('scheduledDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isDragOver, setIsDragOver] = useState(false);

  const sortedPosts = [...posts].sort((a, b) => {
    const aValue = sortField === 'content' ? a.content : new Date(a.scheduledDate).getTime();
    const bValue = sortField === 'content' ? b.content : new Date(b.scheduledDate).getTime();
    return sortDirection === 'asc' 
      ? aValue > bValue ? 1 : -1
      : aValue < bValue ? 1 : -1;
  });

  const handleSort = (field: 'content' | 'scheduledDate') => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const postId = e.dataTransfer.getData('text/plain');
    if (postId) {
      onPostMove(postId);
    }
  };

  return (
    <div 
      className="flex flex-col h-full"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center gap-1 mb-1 px-1 bg-[#c0c0c0] win95-shadow p-1">
        <button
          onClick={() => setViewMode('list')}
          className={`px-2 py-1 text-sm ${
            viewMode === 'list' ? 'win95-inset bg-[#808080]' : 'win95-shadow'
          }`}
        >
          List
        </button>
        <button
          onClick={() => setViewMode('icons')}
          className={`px-2 py-1 text-sm ${
            viewMode === 'icons' ? 'win95-inset bg-[#808080]' : 'win95-shadow'
          }`}
        >
          Icons
        </button>
      </div>

      {posts.length === 0 ? (
        <div className={`flex-1 flex items-center justify-center bg-white win95-inset p-4 
          ${isDragOver ? 'bg-[#000080] text-white' : ''}`}>
          <span className="text-gray-500">Drop items here</span>
        </div>
      ) : viewMode === 'list' ? (
        <div className="flex-1 bg-white win95-inset overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#c0c0c0] select-none">
                <th 
                  className="text-left p-1 border-r border-b border-[#808080] cursor-pointer"
                  onClick={() => handleSort('content')}
                >
                  Name {sortField === 'content' && (sortDirection === 'asc' ? '▲' : '▼')}
                </th>
                <th 
                  className="text-left p-1 border-r border-b border-[#808080] cursor-pointer w-[150px]"
                  onClick={() => handleSort('scheduledDate')}
                >
                  Date {sortField === 'scheduledDate' && (sortDirection === 'asc' ? '▲' : '▼')}
                </th>
                <th className="text-left p-1 border-r border-b border-[#808080] w-[80px]">Type</th>
                <th className="text-left p-1 border-b border-[#808080] w-[80px]">Size</th>
              </tr>
            </thead>
            <tbody>
              {sortedPosts.map((post) => (
                <tr
                  key={post.id}
                  className="hover:bg-[#000080] hover:text-white cursor-pointer"
                  onClick={() => onPostClick(post)}
                >
                  <td className="p-1 border-r border-[#dfdfdf]">
                    <div className="flex items-center gap-2">
                      <img 
                        src={ICONS.NOTEPAD} 
                        alt="" 
                        className="w-4 h-4"
                        style={{ imageRendering: 'pixelated' }}
                      />
                      <span className="truncate">{post.content}</span>
                    </div>
                  </td>
                  <td className="p-1 border-r border-[#dfdfdf] whitespace-nowrap">
                    {format(new Date(post.scheduledDate), 'MM/dd/yyyy hh:mm a')}
                  </td>
                  <td className="p-1 border-r border-[#dfdfdf]">Post</td>
                  <td className="p-1">{post.content.length} B</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex-1 bg-white win95-inset p-2 overflow-auto">
          <div className="grid gap-4" style={{
            gridTemplateColumns: `repeat(auto-fill, ${DESKTOP_CONSTANTS.GRID_SIZE}px)`,
            gridAutoRows: DESKTOP_CONSTANTS.GRID_SIZE
          }}>
            {sortedPosts.map((post) => (
              <div
                key={post.id}
                className="flex flex-col items-center text-center p-2 cursor-pointer hover:bg-[#000080] hover:text-white"
                onClick={() => onPostClick(post)}
              >
                <img 
                  src={ICONS.NOTEPAD} 
                  alt="" 
                  className="w-8 h-8 mb-1"
                  style={{ imageRendering: 'pixelated' }}
                />
                <div className="text-xs leading-tight line-clamp-2">
                  {post.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}