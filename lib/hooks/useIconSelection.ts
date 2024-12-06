'use client';

import { useState } from 'react';

export function useIconSelection() {
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);

  const clearSelection = () => setSelectedIconId(null);
  const selectIcon = (id: string) => setSelectedIconId(id);

  return {
    selectedIconId,
    clearSelection,
    selectIcon,
  };
}