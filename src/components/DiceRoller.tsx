import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { rollDice, RollResult } from '../utils/diceRoller';

interface DiceRollerProps {
  visible: boolean;
  onClose: () => void;
}

const DICE_TYPES = [4, 6, 8, 10, 12, 20, 100];

export const DiceRoller: React.FC<DiceRollerProps> = ({ visible, onClose }) => {
  const [history, setHistory] = useState<RollResult[]>([]);

  const handleRoll = (sides: number) => {
    const result = rollDice(1, sides);
    setHistory(prev => [result, ...prev].slice(0, 10)); // Keep last 10 rolls
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Бросок кубиков</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.diceContainer}>
            {DICE_TYPES.map(sides => (
              <TouchableOpacity
                key={sides}
                style={styles.diceButton}
                onPress={() => handleRoll(sides)}
              >
                <Text style={styles.diceButtonText}>d{sides}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.historyTitle}>История бросков:</Text>
          <ScrollView style={styles.historyList}>
            {history.map((roll, index) => (
              <View key={roll.timestamp + index} style={styles.historyItem}>
                <Text style={styles.historyFormula}>{roll.formula}:</Text>
                <Text style={styles.historyResult}>{roll.total}</Text>
                <Text style={styles.historyDetails}>({roll.rolls.join(' + ')})</Text>
              </View>
            ))}
            {history.length === 0 && (
              <Text style={styles.emptyHistory}>Нет бросков</Text>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '60%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
  diceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  diceButton: {
    width: '23%',
    aspectRatio: 1,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2196f3',
  },
  diceButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1565c0',
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  historyList: {
    maxHeight: 200,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  historyFormula: {
    fontSize: 16,
    color: '#666',
    width: 60,
  },
  historyResult: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    width: 50,
  },
  historyDetails: {
    fontSize: 14,
    color: '#999',
  },
  emptyHistory: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
});

