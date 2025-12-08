import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { BattleProvider } from './src/context/BattleContext';
import { SettingsProvider } from './src/context/SettingsContext';
import { AppNavigator } from './src/navigation/AppNavigator';

const App: React.FC = () => {
  return (
    <SettingsProvider>
      <BattleProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </BattleProvider>
    </SettingsProvider>
  );
};

export default App;

