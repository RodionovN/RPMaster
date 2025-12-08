import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Participant } from '../types';
import { StorageService } from '../services/StorageService';

interface BattleContextType {
  participants: Participant[];
  addParticipant: (participant: Participant) => void;
  removeParticipant: (id: string) => void;
  updateHP: (id: string, delta: number) => void;
  updateInitiative: (id: string, value: number) => void;
  addCondition: (id: string, conditionId: string) => void;
  removeCondition: (id: string, conditionId: string) => void;
  sortParticipants: () => void;
}

const BattleContext = createContext<BattleContextType | undefined>(undefined);

export const BattleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state on mount
  useEffect(() => {
    const loadState = async () => {
      const savedParticipants = await StorageService.loadBattleState();
      if (savedParticipants && savedParticipants.length > 0) {
        setParticipants(savedParticipants);
      } else {
        // Default mock data if storage is empty
        setParticipants([
          { id: '1', name: 'Арагорн', maxHP: 50, currentHP: 45, armorClass: 16 },
          { id: '2', name: 'Гэндальф', maxHP: 35, currentHP: 35, armorClass: 12 },
          { id: '3', name: 'Гоблин', maxHP: 7, currentHP: 7, armorClass: 15 },
        ]);
      }
      setIsLoaded(true);
    };
    loadState();
  }, []);

  // Save state on change
  useEffect(() => {
    if (isLoaded) {
      StorageService.saveBattleState(participants);
    }
  }, [participants, isLoaded]);

  const addParticipant = (participant: Participant) => {
    setParticipants((prev) => [...prev, participant]);
  };

  const removeParticipant = (id: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  const updateHP = (id: string, delta: number) => {
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const newHP = Math.max(0, Math.min(p.maxHP, p.currentHP + delta));
        return { ...p, currentHP: newHP };
      })
    );
  };

  const updateInitiative = (id: string, value: number) => {
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        return { ...p, initiative: value };
      })
    );
  };

  const addCondition = (id: string, conditionId: string) => {
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const currentConditions = p.conditions || [];
        if (currentConditions.includes(conditionId)) return p;
        return { ...p, conditions: [...currentConditions, conditionId] };
      })
    );
  };

  const removeCondition = (id: string, conditionId: string) => {
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const currentConditions = p.conditions || [];
        return { ...p, conditions: currentConditions.filter(c => c !== conditionId) };
      })
    );
  };

  const sortParticipants = () => {
    setParticipants((prev) =>
      [...prev].sort((a, b) => {
        const initA = a.initiative || 0;
        const initB = b.initiative || 0;
        return initB - initA; // По убыванию
      })
    );
  };

  return (
    <BattleContext.Provider 
      value={{ 
        participants, 
        addParticipant, 
        removeParticipant, 
        updateHP,
        updateInitiative,
        addCondition,
        removeCondition,
        sortParticipants
      }}
    >
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

