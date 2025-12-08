import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, lightTheme, darkTheme } from '../utils/theme';

type ThemeMode = 'light' | 'dark' | 'system';

interface SettingsContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  theme: Theme;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const THEME_KEY = 'rpmaster_theme_mode';

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_KEY);
        if (savedTheme) {
          setThemeMode(savedTheme as ThemeMode);
        }
      } catch (e) {
        console.error('Failed to load settings', e);
      }
    };
    loadSettings();
  }, []);

  const changeThemeMode = async (mode: ThemeMode) => {
    setThemeMode(mode);
    try {
      await AsyncStorage.setItem(THEME_KEY, mode);
    } catch (e) {
      console.error('Failed to save theme setting', e);
    }
  };

  const activeTheme = 
    themeMode === 'system' 
      ? (systemColorScheme === 'dark' ? darkTheme : lightTheme)
      : (themeMode === 'dark' ? darkTheme : lightTheme);

  return (
    <SettingsContext.Provider 
      value={{ 
        themeMode, 
        setThemeMode: changeThemeMode, 
        theme: activeTheme 
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

