import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, TouchableOpacity } from 'react-native';
import { Participant } from '../types';

interface ParticipantDetailProps {
  participant: Participant | null;
  onUpdateHP: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

export const ParticipantDetail: React.FC<ParticipantDetailProps> = ({ 
  participant, 
  onUpdateHP,
  onRemove
}) => {
  const [hpInput, setHpInput] = useState('1');

  if (!participant) {
    return (
      <View style={styles.container}>
        <Text style={styles.placeholder}>Выберите участника</Text>
      </View>
    );
  }

  const hpPercentage = (participant.currentHP / participant.maxHP) * 100;
  const hpColor = hpPercentage > 60 ? '#4caf50' : hpPercentage > 30 ? '#ff9800' : '#f44336';

  const handleHeal = () => {
    const amount = parseInt(hpInput);
    if (!isNaN(amount)) {
      onUpdateHP(participant.id, amount);
      setHpInput('1');
    }
  };

  const handleDamage = () => {
    const amount = parseInt(hpInput);
    if (!isNaN(amount)) {
      onUpdateHP(participant.id, -amount);
      setHpInput('1');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{participant.name}</Text>
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={() => onRemove(participant.id)}
        >
          <Text style={styles.deleteButtonText}>Удалить</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Класс брони</Text>
          <Text style={styles.statValue}>{participant.armorClass}</Text>
        </View>
        
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Здоровье</Text>
          <Text style={[styles.statValue, { color: hpColor }]}>
            {participant.currentHP} / {participant.maxHP}
          </Text>
        </View>
      </View>

      <View style={styles.hpControls}>
        <Text style={styles.sectionTitle}>Управление здоровьем</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={hpInput}
            onChangeText={setHpInput}
            keyboardType="number-pad"
            placeholder="Количество"
          />
        </View>

        <View style={styles.buttonGroup}>
          <View style={styles.buttonWrapper}>
            <Button title="Урон" onPress={handleDamage} color="#f44336" />
          </View>
          <View style={{ width: 10 }} />
          <View style={styles.buttonWrapper}>
            <Button title="Лечение" onPress={handleHeal} color="#4caf50" />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  placeholder: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  deleteButton: {
    backgroundColor: '#ffebee',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: '#d32f2f',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  hpControls: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  buttonWrapper: {
    flex: 1,
  },
});

