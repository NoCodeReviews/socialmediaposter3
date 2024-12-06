'use client';

import { useState } from 'react';
import { savePost } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { WindowPosition } from '@/lib/types';

interface PostFormProps {
  onPostCreated: () => void;
  existingPositions: WindowPosition[];
}

export function PostForm({ onPostCreated, existingPositions }: PostFormProps) {
  const [content, setContent] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || !scheduledDate) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    savePost({
      content,
      scheduledDate: new Date(scheduledDate).toISOString(),
    }, existingPositions);

    setContent('');
    setScheduledDate('');
    onPostCreated();

    toast({
      title: 'Success',
      description: 'Post scheduled successfully',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm">Post Content:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full min-h-[100px] p-2 win95-inset bg-white"
          placeholder="What's on your mind?"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm">Schedule Date:</label>
        <input
          type="datetime-local"
          value={scheduledDate}
          onChange={(e) => setScheduledDate(e.target.value)}
          className="w-full p-2 win95-inset bg-white"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-[#c0c0c0] p-2 win95-shadow hover:win95-inset active:win95-inset"
      >
        Schedule Post
      </button>
    </form>
  );
}