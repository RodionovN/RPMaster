import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Participant } from '../types';
import { ConditionModal } from './ConditionModal';
import { CONDITIONS } from '../utils/conditions';

interface ParticipantDetailProps {
  participant: Participant | null;
  onUpdateHP: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onUpdateInitiative?: (id: string, value: number) => void;
  onAddCondition?: (id: string, conditionId: string) => void;
  onRemoveCondition?: (id: string, conditionId: string) => void;
}

export const ParticipantDetail: React.FC<ParticipantDetailProps> = ({ 
  participant, 
  onUpdateHP,
  onRemove,
  onUpdateInitiative,
  onAddCondition,
  onRemoveCondition
}) => {
  const [hpInput, setHpInput] = useState('1');
  const [initInput, setInitInput] = useState('');
  const [isConditionModalVisible, setConditionModalVisible] = useState(false);

  if (!participant) {
    return (
      <View style={styles.container}>
        <Text style={styles.placeholder}>Выберите участника</Text>
      </View>
    );
  }

  // Обновляем initInput при смене участника
  React.useEffect(() => {
    setInitInput(participant.initiative?.toString() || '');
  }, [participant.id, participant.initiative]);

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

  const handleInitChange = (text: string) => {
    setInitInput(text);
    const val = parseInt(text);
    if (!isNaN(val) && onUpdateInitiative) {
      onUpdateInitiative(participant.id, val);
    }
  };

  const handleConditionToggle = (conditionId: string) => {
    if (!participant || !onAddCondition || !onRemoveCondition) return;
    
    const hasCondition = participant.conditions?.includes(conditionId);
    if (hasCondition) {
      onRemoveCondition(participant.id, conditionId);
    } else {
      onAddCondition(participant.id, conditionId);
    }
  };

  const activeConditions = participant.conditions || [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
            <Text style={styles.name}>{participant.name}</Text>
            <View style={styles.initContainer}>
                <Text style={styles.initLabel}>Иниц:</Text>
                <TextInput 
                    style={styles.initInput}
                    value={initInput}
                    onChangeText={handleInitChange}
                    keyboardType="number-pad"
                    placeholder="0"
                />
            </View>
        </View>
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

      <View style={styles.conditionsContainer}>
        <View style={styles.conditionsHeader}>
            <Text style={styles.sectionTitle}>Состояния</Text>
            <TouchableOpacity onPress={() => setConditionModalVisible(true)}>
                <Text style={styles.addConditionText}>+ Добавить</Text>
            </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.conditionsList}>
            {activeConditions.length === 0 && <Text style={styles.noConditions}>Нет активных состояний</Text>}
            {activeConditions.map(cId => {
                const condition = CONDITIONS.find(c => c.id === cId);
                if (!condition) return null;
                return (
                    <TouchableOpacity 
                        key={cId} 
                        style={[styles.conditionBadge, { backgroundColor: condition.color }]}
                        onPress={() => onRemoveCondition && onRemoveCondition(participant.id, cId)}
                    >
                        <Text style={styles.conditionText}>{condition.name} ✕</Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
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

      <ConditionModal
        visible={isConditionModalVisible}
        onClose={() => setConditionModalVisible(false)}
        onSelect={handleConditionToggle}
        activeConditions={activeConditions}
      />
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
  initContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  initLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  initInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    minWidth: 40,
    textAlign: 'center',
    fontSize: 16,
    padding: 2,
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
  conditionsContainer: {
    marginBottom: 20,
  },
  conditionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  addConditionText: {
    color: '#2196f3',
    fontWeight: 'bold',
  },
  conditionsList: {
    flexDirection: 'row',
  },
  conditionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  conditionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  noConditions: {
    color: '#999',
    fontStyle: 'italic',
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

