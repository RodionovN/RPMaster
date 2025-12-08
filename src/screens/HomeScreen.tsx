import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSettings } from '../context/SettingsContext';
// Define the navigation types here or in a separate types file
// Types are now defined in AppNavigator.tsx to avoid circular dependency
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useSettings();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>RPMaster</Text>
      <View style={styles.buttonContainer}>
        <Button 
          title="Начать бой" 
          onPress={() => navigation.navigate('Battle')} 
          color={theme.colors.primary}
        />
        <View style={{ height: 16 }} />
        <Button 
          title="Импорт персонажа" 
          onPress={() => navigation.navigate('Import')} 
          color="#9c27b0"
        />
        <View style={{ height: 16 }} />
        <Button 
          title="Настройки" 
          onPress={() => navigation.navigate('Settings')} 
          color={theme.colors.textSecondary}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '80%',
    maxWidth: 300,
  },
});

