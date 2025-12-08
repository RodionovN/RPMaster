import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { BattleScreen } from '../screens/BattleScreen';
import { ImportScreen } from '../screens/ImportScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { useSettings } from '../context/SettingsContext';

export type RootStackParamList = {
  Home: undefined;
  Battle: undefined;
  Import: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const { theme } = useSettings();

  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        dark: false, // Override system, we handle colors manually
        colors: {
          ...DefaultTheme.colors,
          primary: theme.colors.primary,
          background: theme.colors.background,
          card: theme.colors.surface,
          text: theme.colors.text,
          border: theme.colors.border,
          notification: theme.colors.secondary,
        },
      }}
    >
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.text,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
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
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{ title: 'Настройки' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

