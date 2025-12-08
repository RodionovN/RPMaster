import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Participant } from '../types';

interface LibraryContextType {
  library: Participant[];
  addToLibrary: (participant: Participant) => void;
  removeFromLibrary: (id: string) => void;
  isInLibrary: (id: string) => boolean;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [library, setLibrary] = useState<Participant[]>([]);

  useEffect(() => {
    loadLibrary();
  }, []);

  useEffect(() => {
    saveLibrary();
  }, [library]);

  const loadLibrary = async () => {
    try {
      const storedLibrary = await AsyncStorage.getItem('library_data');
      if (storedLibrary) {
        setLibrary(JSON.parse(storedLibrary));
      }
    } catch (error) {
      console.error('Failed to load library:', error);
    }
  };

  const saveLibrary = async () => {
    try {
      await AsyncStorage.setItem('library_data', JSON.stringify(library));
    } catch (error) {
      console.error('Failed to save library:', error);
    }
  };

  const addToLibrary = (participant: Participant) => {
    setLibrary(prev => {
      // Avoid duplicates by ID (though ID might change for new instances in battle)
      // Maybe check by name? Or just allow duplicates?
      // Better: Check by ID, if exists, update it.
      const exists = prev.find(p => p.id === participant.id);
      if (exists) {
        return prev.map(p => p.id === participant.id ? participant : p);
      }
      return [...prev, participant];
    });
  };

  const removeFromLibrary = (id: string) => {
    setLibrary(prev => prev.filter(p => p.id !== id));
  };

  const isInLibrary = (id: string) => {
    return library.some(p => p.id === id);
  };

  return (
    <LibraryContext.Provider value={{ library, addToLibrary, removeFromLibrary, isInLibrary }}>
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};

