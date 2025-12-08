import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Participant } from '../types';

interface InitiativeSidebarProps {
  participants: Participant[];
  selectedId: string | null;
  activeId: string | null;
  onSelect: (id: string) => void;
}

export const InitiativeSidebar: React.FC<InitiativeSidebarProps> = ({ 
  participants, 
  selectedId, 
  activeId,
  onSelect 
}) => {
  const renderItem = ({ item }: { item: Participant }) => {
    const isSelected = item.id === selectedId;
    const isActive = item.id === activeId;
    const initial = item.name.charAt(0).toUpperCase();
    
    // Генерируем цвет на основе имени для постоянства
    const getColor = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      const c = (hash & 0x00ffffff).toString(16).toUpperCase();
      return '#' + '00000'.substring(0, 6 - c.length) + c;
    };

    const avatarColor = getColor(item.name);

    return (
      <TouchableOpacity 
        style={[
          styles.item, 
          isSelected && styles.selectedItem,
          isActive && styles.activeItem
        ]} 
        onPress={() => onSelect(item.id)}
      >
        <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <Text style={[styles.name, isActive && styles.activeText]} numberOfLines={1}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={participants}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  item: {
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  selectedItem: {
    backgroundColor: '#e3f2fd',
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  activeItem: {
    backgroundColor: '#fff9c4', // Желтоватый фон для активного хода
    borderLeftWidth: 4,
    borderLeftColor: '#fbc02d', // Золотая полоса
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  name: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  },
  activeText: {
    fontWeight: 'bold',
    color: '#fbc02d',
  },
});

