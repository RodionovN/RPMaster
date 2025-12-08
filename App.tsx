import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { BattleProvider } from './src/context/BattleContext';
import { SettingsProvider } from './src/context/SettingsContext';
import { LibraryProvider } from './src/context/LibraryContext';
import { AppNavigator } from './src/navigation/AppNavigator';

const App: React.FC = () => {
  return (
    <SettingsProvider>
      <LibraryProvider>
        <BattleProvider>
          <StatusBar style="auto" />
          <AppNavigator />
        </BattleProvider>
      </LibraryProvider>
    </SettingsProvider>
  );
};

export default App;

