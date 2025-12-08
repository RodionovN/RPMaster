import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Participant } from '../types';

interface BattleContextType {
  participants: Participant[];
  addParticipant: (participant: Participant) => void;
  removeParticipant: (id: string) => void;
}

const BattleContext = createContext<BattleContextType | undefined>(undefined);

export const BattleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [participants, setParticipants] = useState<Participant[]>([
    { id: '1', name: 'Арагорн', maxHP: 50, currentHP: 45, armorClass: 16 },
    { id: '2', name: 'Гэндальф', maxHP: 35, currentHP: 35, armorClass: 12 },
    { id: '3', name: 'Гоблин', maxHP: 7, currentHP: 7, armorClass: 15 },
  ]);

  const addParticipant = (participant: Participant) => {
    setParticipants((prev) => [...prev, participant]);
  };

  const removeParticipant = (id: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <BattleContext.Provider value={{ participants, addParticipant, removeParticipant }}>
      {children}
    </BattleContext.Provider>
  );
};

export const useBattle = () => {
  const context = useContext(BattleContext);
  if (context === undefined) {
    throw new Error('useBattle must be used within a BattleProvider');
  }
  return context;
};

