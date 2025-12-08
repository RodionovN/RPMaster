import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RollResult } from '../utils/diceRoller';

interface QuickRollResultProps {
  result: RollResult | null;
  onClose: () => void;
}

export const QuickRollResult: React.FC<QuickRollResultProps> = ({ result, onClose }) => {
  if (!result) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Бросок: {result.formula}</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={styles.total}>{result.total}</Text>
        <Text style={styles.details}>
            {result.rolls.length > 1 ? result.rolls.join(' + ') : ''} 
            {result.rolls.length > 1 ? ' = ' : ''} 
            {result.total}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 220,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontSize: 16,
    color: '#999',
    fontWeight: 'bold',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  total: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#2196f3',
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

