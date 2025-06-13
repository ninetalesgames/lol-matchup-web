// src/LevelContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { loadNotes } from './services/DataService';
import { calculateLevel } from './utils/level';

type LevelContextType = {
  level: number;
  totalGames: number;
};

const LevelContext = createContext<LevelContextType>({ level: 0, totalGames: 0 });

export function LevelProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [level, setLevel] = useState(0);
  const [totalGames, setTotalGames] = useState(0);

  useEffect(() => {
    const fetchLevel = async () => {
      const notes = await loadNotes(user);
      const games = Object.values(notes).reduce(
        (sum, note: any) => sum + (note.wins || 0) + (note.losses || 0),
        0
      );
      setTotalGames(games);
      setLevel(calculateLevel(games));
    };
    fetchLevel();
  }, [user]);

  return (
    <LevelContext.Provider value={{ level, totalGames }}>
      {children}
    </LevelContext.Provider>
  );
}

export function useLevel() {
  return useContext(LevelContext);
}
