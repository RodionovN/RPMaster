import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { BattleProvider } from './src/context/BattleContext';
import { AppNavigator } from './src/navigation/AppNavigator';

const App: React.FC = () => {
  return (
    <BattleProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </BattleProvider>
  );
};

export default App;

