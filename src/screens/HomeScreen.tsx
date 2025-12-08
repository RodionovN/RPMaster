import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define the navigation types here or in a separate types file
// Types are now defined in AppNavigator.tsx to avoid circular dependency
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RPMaster</Text>
      <View style={styles.buttonContainer}>
        <Button 
          title="Начать бой" 
          onPress={() => navigation.navigate('Battle')} 
          color="#2196f3"
        />
        <View style={{ height: 16 }} />
        <Button 
          title="Импорт персонажа" 
          onPress={() => navigation.navigate('Import')} 
          color="#9c27b0"
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
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  buttonContainer: {
    width: '80%',
    maxWidth: 300,
  },
});

