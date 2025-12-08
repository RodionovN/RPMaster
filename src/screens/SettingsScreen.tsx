import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSettings } from '../context/SettingsContext';

export const SettingsScreen: React.FC = () => {
  const { themeMode, setThemeMode, theme } = useSettings();

  const options: { label: string; value: 'light' | 'dark' | 'system' }[] = [
    { label: 'Светлая', value: 'light' },
    { label: 'Темная', value: 'dark' },
    { label: 'Системная', value: 'system' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Настройки</Text>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>Тема оформления</Text>
        <View style={styles.optionsContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.option,
                { borderColor: theme.colors.border },
                themeMode === option.value && { backgroundColor: theme.colors.primary + '20', borderColor: theme.colors.primary }
              ]}
              onPress={() => setThemeMode(option.value)}
            >
              <Text 
                style={[
                  styles.optionText, 
                  { color: theme.colors.text },
                  themeMode === option.value && { color: theme.colors.primary, fontWeight: 'bold' }
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 16,
  },
});

