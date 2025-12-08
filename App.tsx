import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { BattleScreen } from './src/screens/BattleScreen';
import { BattleProvider } from './src/context/BattleContext';

const App: React.FC = () => {
  return (
    <BattleProvider>
      <StatusBar style="auto" />
      <BattleScreen />
    </BattleProvider>
  );
};

export default App;

