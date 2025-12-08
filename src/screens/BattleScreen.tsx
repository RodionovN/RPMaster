import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { ParticipantList } from '../components/ParticipantList';
import { useBattle } from '../context/BattleContext';
import { Participant } from '../types';

export const BattleScreen: React.FC = () => {
  const { participants, addParticipant, removeParticipant } = useBattle();

  const handleAddPlayer = () => {
    const newPlayer: Participant = {
      id: Date.now().toString(),
      name: `Игрок ${participants.length + 1}`,
      maxHP: 20,
      currentHP: 20,
      armorClass: 10,
    };
    addParticipant(newPlayer);
  };

  const handleAddMonster = () => {
    const newMonster: Participant = {
      id: Date.now().toString(),
      name: `Монстр ${participants.length + 1}`,
      maxHP: 10,
      currentHP: 10,
      armorClass: 12,
    };
    addParticipant(newMonster);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Боевая сцена</Text>
        <View style={styles.controls}>
          <Button title="Добавить игрока" onPress={handleAddPlayer} />
          <View style={{ width: 10 }} />
          <Button title="Добавить монстра" onPress={handleAddMonster} color="#ff9800" />
        </View>
        <ParticipantList 
          participants={participants} 
          onRemoveParticipant={removeParticipant} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  controls: {
    flexDirection: 'row',
    marginBottom: 16,
  },
});

