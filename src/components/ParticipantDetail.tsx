import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Participant, Stat } from '../types';
import { ConditionModal } from './ConditionModal';
import { CONDITIONS } from '../utils/conditions';
import { calculateModifier } from '../utils/dndUtils';

interface ParticipantDetailProps {
  participant: Participant | null;
  onUpdateHP: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onUpdateInitiative?: (id: string, value: number) => void;
  onAddCondition?: (id: string, conditionId: string) => void;
  onRemoveCondition?: (id: string, conditionId: string) => void;
  onRoll?: (formula: string) => void;
  onUpdate?: (id: string, data: Partial<Participant>) => void;
}

export const ParticipantDetail: React.FC<ParticipantDetailProps> = ({ 
  participant, 
  onUpdateHP,
  onRemove,
  onUpdateInitiative,
  onAddCondition,
  onRemoveCondition,
  onRoll,
  onUpdate
}) => {
  const [hpInput, setHpInput] = useState('1');
  const [initInput, setInitInput] = useState('');
  const [isConditionModalVisible, setConditionModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'main' | 'attacks' | 'abilities' | 'stats'>('main');
  const [isEditing, setIsEditing] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState('');
  const [editHP, setEditHP] = useState('');
  const [editAC, setEditAC] = useState('');
  const [editLevel, setEditLevel] = useState('');

  useEffect(() => {
    if (participant) {
      setInitInput(participant.initiative?.toString() || '');
      setEditName(participant.name);
      setEditHP(participant.maxHP.toString());
      setEditAC(participant.armorClass.toString());
      setEditLevel(participant.level?.toString() || '1');
    }
  }, [participant?.id, participant?.initiative]);

  if (!participant) {
    return (
      <View style={styles.container}>
        <Text style={styles.placeholder}>Выберите участника</Text>
      </View>
    );
  }

  const handleSave = () => {
    if (onUpdate) {
        const level = parseInt(editLevel) || 1;
        const pb = Math.ceil(level / 4) + 1;
        
        onUpdate(participant.id, {
            name: editName,
            maxHP: parseInt(editHP) || 10,
            armorClass: parseInt(editAC) || 10,
            level: level,
            proficiencyBonus: pb
        });
        setIsEditing(false);
    }
  };

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

  const handleRoll = (formula: string) => {
    if (onRoll) {
      onRoll(formula);
    }
  };

  const renderEditForm = () => (
    <ScrollView style={styles.editForm}>
        <Text style={styles.editLabel}>Имя:</Text>
        <TextInput style={styles.editInput} value={editName} onChangeText={setEditName} />
        
        <View style={styles.row}>
            <View style={styles.halfInput}>
                <Text style={styles.editLabel}>Макс. HP:</Text>
                <TextInput style={styles.editInput} value={editHP} onChangeText={setEditHP} keyboardType="number-pad" />
            </View>
            <View style={styles.halfInput}>
                <Text style={styles.editLabel}>AC:</Text>
                <TextInput style={styles.editInput} value={editAC} onChangeText={setEditAC} keyboardType="number-pad" />
            </View>
        </View>

        <View style={styles.row}>
            <View style={styles.halfInput}>
                <Text style={styles.editLabel}>Уровень:</Text>
                <TextInput style={styles.editInput} value={editLevel} onChangeText={setEditLevel} keyboardType="number-pad" />
            </View>
            <View style={styles.halfInput}>
                <Text style={styles.editLabel}>Бонус мастерства:</Text>
                <Text style={styles.staticValue}>+{Math.ceil((parseInt(editLevel) || 1) / 4) + 1}</Text>
            </View>
        </View>

        <Button title="Сохранить" onPress={handleSave} color="#2196f3" />
        <View style={{height: 10}} />
        <Button title="Отмена" onPress={() => setIsEditing(false)} color="#757575" />
    </ScrollView>
  );

  const activeConditions = participant.conditions || [];

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'main' && styles.activeTab]} 
        onPress={() => setActiveTab('main')}
      >
        <Text style={[styles.tabText, activeTab === 'main' && styles.activeTabText]}>Главное</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'attacks' && styles.activeTab]} 
        onPress={() => setActiveTab('attacks')}
      >
        <Text style={[styles.tabText, activeTab === 'attacks' && styles.activeTabText]}>Атаки</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'abilities' && styles.activeTab]} 
        onPress={() => setActiveTab('abilities')}
      >
        <Text style={[styles.tabText, activeTab === 'abilities' && styles.activeTabText]}>Спис.</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'stats' && styles.activeTab]} 
        onPress={() => setActiveTab('stats')}
      >
        <Text style={[styles.tabText, activeTab === 'stats' && styles.activeTabText]}>Статы</Text>
      </TouchableOpacity>
    </View>
  );

  const renderMainContent = () => (
    <>
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

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Уровень</Text>
          <Text style={styles.statValue}>{participant.level || 1} (PB: +{participant.proficiencyBonus || 2})</Text>
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
    </>
  );

  const renderAttacks = () => (
    <ScrollView style={styles.scrollContent}>
      {participant.attacks?.map((attack, index) => {
        // Рассчитываем полный модификатор атаки: (statMod + proficiency)
        let hitBonus = 0;
        let dmgBonus = 0;
        
        // Пытаемся найти модификатор характеристики, если он задан как строка 'str', 'dex' и т.д.
        if (attack.stat && participant.stats) {
            const stat = participant.stats.find(s => s.name.toLowerCase() === attack.stat?.toLowerCase());
            if (stat) {
                hitBonus = stat.modifier;
                dmgBonus = stat.modifier;
            }
        } else {
            // Если stat не задан, пробуем распарсить старый формат модификатора "+5"
            hitBonus = parseInt(attack.modifier) || 0;
            dmgBonus = parseInt(attack.modifier) || 0;
        }

        if (attack.isProficient) {
            hitBonus += (participant.proficiencyBonus || 2);
        }

        const hitSign = hitBonus >= 0 ? '+' : '';
        const dmgSign = dmgBonus >= 0 ? '+' : '';

        return (
            <View key={index} style={styles.listItem}>
            <Text style={styles.itemName}>{attack.name}</Text>
            <View style={styles.attackRolls}>
                <TouchableOpacity onPress={() => handleRoll(attack.damage + (dmgBonus ? `${dmgSign}${dmgBonus}` : ''))}>
                <Text style={styles.itemDetail}>Урон: <Text style={styles.clickable}>{attack.damage} {dmgBonus ? `(${dmgSign}${dmgBonus})` : ''}</Text></Text>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={() => handleRoll(`1d20${hitSign}${hitBonus}`)}>
                    <Text style={styles.itemDetail}>Атака: <Text style={styles.clickable}>1d20{hitSign}{hitBonus}</Text></Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.statRef}>Характеристика: {attack.stat?.toUpperCase() || 'Авто'} {attack.isProficient ? '(Владение)' : ''}</Text>
            </View>
        );
      })}
      {(!participant.attacks || participant.attacks.length === 0) && (
        <Text style={styles.emptyText}>Нет данных об атаках</Text>
      )}
    </ScrollView>
  );

  const renderAbilities = () => (
    <ScrollView style={styles.scrollContent}>
      {participant.abilities?.map((ability, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.itemName}>{ability.name}</Text>
          <Text style={styles.itemDescription}>{ability.description}</Text>
        </View>
      ))}
      {(!participant.abilities || participant.abilities.length === 0) && (
        <Text style={styles.emptyText}>Нет данных о способностях</Text>
      )}
    </ScrollView>
  );

  const renderStats = () => (
    <ScrollView style={styles.scrollContent}>
      <Text style={styles.subHeader}>Характеристики</Text>
      <View style={styles.statsGrid}>
        {participant.stats?.map((stat, index) => (
          <View key={index} style={styles.statGridItem}>
            <Text style={styles.statLabel}>{stat.name}</Text>
            <TouchableOpacity onPress={() => handleRoll(`1d20${stat.modifier >= 0 ? '+' : ''}${stat.modifier}`)}>
                <Text style={[styles.statValue, styles.clickable]}>{stat.value} ({stat.modifier >= 0 ? '+' : ''}{stat.modifier})</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      
      <Text style={styles.subHeader}>Навыки</Text>
      {participant.skills?.map((skill, index) => (
        <TouchableOpacity 
            key={index} 
            style={styles.skillRow}
            onPress={() => handleRoll(`1d20${skill.modifier >= 0 ? '+' : ''}${skill.modifier}`)}
        >
          <Text style={styles.skillName}>{skill.name}</Text>
          <Text style={[styles.skillMod, styles.clickable]}>{skill.modifier >= 0 ? '+' : ''}{skill.modifier}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  if (isEditing) {
      return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Редактирование</Text>
            {renderEditForm()}
        </View>
      );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{flex: 1}}>
            <TouchableOpacity onLongPress={() => setIsEditing(true)}>
                <Text style={styles.name}>{participant.name} ✎</Text>
            </TouchableOpacity>
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

      {renderTabs()}

      <View style={styles.contentContainer}>
        {activeTab === 'main' && renderMainContent()}
        {activeTab === 'attacks' && renderAttacks()}
        {activeTab === 'abilities' && renderAbilities()}
        {activeTab === 'stats' && renderStats()}
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
  headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
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
    fontSize: 20,
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
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2196f3',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#2196f3',
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
  },
  listItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemDetail: {
    fontSize: 14,
    color: '#666',
  },
  itemDescription: {
    fontSize: 14,
    color: '#444',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
    fontStyle: 'italic',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  statGridItem: {
    width: '33%',
    alignItems: 'center',
    marginBottom: 12,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 12,
    color: '#333',
    paddingHorizontal: 12,
  },
  skillRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  skillName: {
    fontSize: 14,
    color: '#333',
  },
  skillMod: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  clickable: {
    color: '#2196f3',
    fontWeight: 'bold',
  },
  attackRolls: {
    flexDirection: 'row',
    gap: 16,
  },
  editForm: {
      flex: 1,
  },
  editLabel: {
      fontSize: 16,
      marginBottom: 4,
      color: '#666',
  },
  editInput: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 4,
      padding: 10,
      fontSize: 16,
      marginBottom: 16,
  },
  row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
  },
  halfInput: {
      width: '48%',
  },
  staticValue: {
      fontSize: 18,
      padding: 10,
      fontWeight: 'bold',
  },
  statRef: {
      fontSize: 12,
      color: '#999',
      marginTop: 4,
  }
});
