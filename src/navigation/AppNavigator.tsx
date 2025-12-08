import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { BattleScreen } from '../screens/BattleScreen';
import { ImportScreen } from '../screens/ImportScreen';

export type RootStackParamList = {
  Home: undefined;
  Battle: undefined;
  Import: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Главное меню', headerShown: false }}
        />
        <Stack.Screen 
          name="Battle" 
          component={BattleScreen} 
          options={{ title: 'Бой' }}
        />
        <Stack.Screen 
          name="Import" 
          component={ImportScreen} 
          options={{ title: 'Импорт' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

