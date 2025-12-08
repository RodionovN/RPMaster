import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { InitiativeSidebar } from '../components/InitiativeSidebar';
import { ParticipantDetail } from '../components/ParticipantDetail';
import { DiceRoller } from '../components/DiceRoller';
import { useBattle } from '../context/BattleContext';
import { Participant } from '../types';

export const BattleScreen: React.FC = () => {
  const { 
    participants, 
    addParticipant, 
    removeParticipant, 
    updateHP,
    updateInitiative,
    addCondition,
    removeCondition,
    sortParticipants
  } = useBattle();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDiceRollerVisible, setDiceRollerVisible] = useState(false);

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
      initiative: 0,
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
      initiative: Math.floor(Math.random() * 20) + 1, // Случайная инициатива для монстра
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
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.title}>Бой</Text>
          <TouchableOpacity 
            onPress={sortParticipants} 
            style={[styles.diceButton, {marginLeft: 10}]}
          >
            <Text style={{fontSize: 16}}>⇅ Иниц</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.controls}>
          <TouchableOpacity onPress={() => setDiceRollerVisible(true)} style={styles.diceButton}>
            <Text style={styles.diceButtonText}>🎲</Text>
          </TouchableOpacity>
          <View style={{ width: 10 }} />
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
            onUpdateInitiative={updateInitiative}
            onAddCondition={addCondition}
            onRemoveCondition={removeCondition}
          />
        </View>
      </View>

      <DiceRoller 
        visible={isDiceRollerVisible} 
        onClose={() => setDiceRollerVisible(false)} 
      />
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
    alignItems: 'center',
  },
  diceButton: {
    padding: 8,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginRight: 10,
  },
  diceButtonText: {
    fontSize: 20,
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

