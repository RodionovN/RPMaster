import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Participant} from '../types';

interface ParticipantCardProps {
  participant: Participant;
  onRemove?: (id: string) => void;
}

export const ParticipantCard: React.FC<ParticipantCardProps> = ({
  participant,
  onRemove,
}) => {
  const hpPercentage = (participant.currentHP / participant.maxHP) * 100;
  const getHealthColor = () => {
    if (hpPercentage > 60) return '#4caf50';
    if (hpPercentage > 30) return '#ff9800';
    return '#f44336';
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name}>{participant.name}</Text>
        {onRemove && (
          <TouchableOpacity
            onPress={() => onRemove(participant.id)}
            style={styles.removeButton}>
            <Text style={styles.removeButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.stats}>
        <Text style={styles.hp}>
          HP:{' '}
          <Text style={{color: getHealthColor()}}>{participant.currentHP}</Text>
          /{participant.maxHP}
        </Text>
        <Text style={styles.ac}>AC: {participant.armorClass}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hp: {
    fontSize: 16,
  },
  ac: {
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  removeButton: {
    padding: 4,
  },
  removeButtonText: {
    fontSize: 18,
    color: '#999',
  },
});
