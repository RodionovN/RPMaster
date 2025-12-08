import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen, RootStackParamList } from '../screens/HomeScreen';
import { BattleScreen } from '../screens/BattleScreen';

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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

