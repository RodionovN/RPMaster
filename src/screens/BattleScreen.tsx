import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { InitiativeSidebar } from '../components/InitiativeSidebar';
import { ParticipantDetail } from '../components/ParticipantDetail';
import { useBattle } from '../context/BattleContext';
import { Participant } from '../types';

export const BattleScreen: React.FC = () => {
  const { participants, addParticipant, removeParticipant, updateHP } = useBattle();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Автоматически выбираем первого участника при загрузке или изменении списка
  useEffect(() => {
    if (participants.length > 0 && !selectedId) {
      setSelectedId(participants[0].id);
    } else if (participants.length === 0) {
      setSelectedId(null);
    }
  }, [participants, selectedId]);

  const selectedParticipant = participants.find(p => p.id === selectedId) || null;

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

  const handleRemove = (id: string) => {
    removeParticipant(id);
    if (id === selectedId) {
      setSelectedId(null); // Сброс выбора при удалении
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Бой</Text>
        <View style={styles.controls}>
          <Button title="+ Игрок" onPress={handleAddPlayer} />
          <View style={{ width: 10 }} />
          <Button title="+ Монстр" onPress={handleAddMonster} color="#ff9800" />
        </View>
      </View>
      
      <View style={styles.content}>
        <View style={styles.sidebar}>
          <InitiativeSidebar 
            participants={participants}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </View>
        <View style={styles.main}>
          <ParticipantDetail 
            participant={selectedParticipant}
            onUpdateHP={updateHP}
            onRemove={handleRemove}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  controls: {
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    flex: 1,
    maxWidth: 100, // Ограничиваем ширину сайдбара
  },
  main: {
    flex: 4,
  },
});

