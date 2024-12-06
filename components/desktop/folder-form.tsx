'use client';

import { useState } from 'react';
import { Modal } from './modal';

interface FolderFormProps {
  onSubmit: (name: string) => void;
  onClose: () => void;
}

export function FolderForm({ onSubmit, onClose }: FolderFormProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Folder name is required');
      return;
    }

    if (name.length > 255) {
      setError('Folder name is too long');
      return;
    }

    if (!/^[a-zA-Z0-9\s-_]+$/.test(name)) {
      setError('Invalid characters in folder name');
      return;
    }

    onSubmit(name);
    onClose();
  };

  return (
    <Modal title="New Folder" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Folder Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            className="w-full p-2 win95-inset bg-white"
            autoFocus
          />
          {error && <p className="text-red-600 mt-1 text-sm">{error}</p>}
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 win95-shadow hover:win95-inset"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 win95-shadow hover:win95-inset"
          >
            Create
          </button>
        </div>
      </form>
    </Modal>
  );
}