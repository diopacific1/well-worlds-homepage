import { useState, useCallback } from "react";
import { toast } from "../components/Toast";

export function useAssetFavorites(storageKey: string) {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  const toggleFavorite = useCallback((id: string, currentFavorites: string[]) => {
    const isAdding = !currentFavorites.includes(id);
    if (isAdding) {
      toast.success(`${id.toUpperCase()}이(가) 관심 자산에 추가되었습니다.`);
    } else {
      toast.info(`${id.toUpperCase()}이(가) 관심 자산에서 제거되었습니다.`);
    }

    setFavorites((prev) => {
      const updated = isAdding
        ? [...prev, id]
        : prev.filter((f) => f !== id);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      return updated;
    });
  }, [storageKey]);

  return { favorites, toggleFavorite };
}
