import React, { createContext, useContext, useState } from 'react';
import type { MantraEntry } from '../types/practice';

interface MenuContextValue {
  isMenuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  isAshtothramOpen: boolean;
  openAshtothram: () => void;
  closeAshtothram: () => void;
  isMantraLibraryOpen: boolean;
  openMantraLibrary: () => void;
  closeMantraLibrary: () => void;
  isPanchangamOpen: boolean;
  openPanchangam: () => void;
  closePanchangam: () => void;
  isNityaPoojaOpen: boolean;
  openNityaPooja: () => void;
  closeNityaPooja: () => void;
  selectedAshtothramForJapa: MantraEntry | null;
  startJapaWithAshtothram: (ashtothram: MantraEntry) => void;
  clearSelectedAshtothram: () => void;
}

const MenuContext = createContext<MenuContextValue | null>(null);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAshtothramOpen, setIsAshtothramOpen] = useState(false);
  const [isMantraLibraryOpen, setIsMantraLibraryOpen] = useState(false);
  const [isPanchangamOpen, setIsPanchangamOpen] = useState(false);
  const [isNityaPoojaOpen, setIsNityaPoojaOpen] = useState(false);
  const [selectedAshtothramForJapa, setSelectedAshtothramForJapa] =
    useState<MantraEntry | null>(null);

  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);

  const openAshtothram = () => setIsAshtothramOpen(true);
  const closeAshtothram = () => setIsAshtothramOpen(false);

  const openMantraLibrary = () => setIsMantraLibraryOpen(true);
  const closeMantraLibrary = () => setIsMantraLibraryOpen(false);

  const openPanchangam = () => setIsPanchangamOpen(true);
  const closePanchangam = () => setIsPanchangamOpen(false);

  const openNityaPooja = () => setIsNityaPoojaOpen(true);
  const closeNityaPooja = () => setIsNityaPoojaOpen(false);

  const startJapaWithAshtothram = (ashtothram: MantraEntry) => {
    setSelectedAshtothramForJapa(ashtothram);
    setIsAshtothramOpen(false);
    setIsMenuOpen(false);
  };

  const clearSelectedAshtothram = () => {
    setSelectedAshtothramForJapa(null);
  };

  return (
    <MenuContext.Provider
      value={{
        isMenuOpen,
        openMenu,
        closeMenu,
        isAshtothramOpen,
        openAshtothram,
        closeAshtothram,
        isMantraLibraryOpen,
        openMantraLibrary,
        closeMantraLibrary,
        isPanchangamOpen,
        openPanchangam,
        closePanchangam,
        isNityaPoojaOpen,
        openNityaPooja,
        closeNityaPooja,
        selectedAshtothramForJapa,
        startJapaWithAshtothram,
        clearSelectedAshtothram,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useAppMenu(): MenuContextValue {
  const ctx = useContext(MenuContext);
  if (!ctx) {
    throw new Error('useAppMenu must be used within a MenuProvider');
  }
  return ctx;
}
