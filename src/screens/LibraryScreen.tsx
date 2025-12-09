import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Platform, TextInput } from 'react-native';
import { useLibrary } from '../context/LibraryContext';
import { useBattle } from '../context/BattleContext';
import { Participant } from '../types';
import { useNavigation } from '@react-navigation/native';
import { useSettings } from '../context/SettingsContext';
import { ConfirmationModal } from '../components/ConfirmationModal';

type SortOption = 'name' | 'level' | 'date';

export const LibraryScreen: React.FC = () => {
  const { library, removeFromLibrary } = useLibrary();
  const { addParticipant } = useBattle();
  const { theme } = useSettings();
  const navigation = useNavigation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [deleteModal, setDeleteModal] = useState<{ visible: boolean; id: string | null; name: string }>({
    visible: false,
    id: null,
    name: '',
  });

  const filteredAndSortedLibrary = useMemo(() => {
    let result = library.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    switch (sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'level':
        result.sort((a, b) => (b.level || 0) - (a.level || 0)); // Descending level
        break;
      case 'date':
        // Assuming ID is timestamp-based or we add a date field later. For now, ID is a good proxy for creation time.
        result.sort((a, b) => b.id.localeCompare(a.id)); // Newest first
        break;
    }

    return result;
  }, [library, searchQuery, sortBy]);

  const handleAddToBattle = (participant: Participant) => {
    // Создаем копию участника с новым ID для боя
    const newParticipant = {
      ...participant,
      id: Date.now().toString(),
      initiative: 0, // Сбрасываем инициативу
    };
    addParticipant(newParticipant);
    
    if (Platform.OS === 'web') {
        alert('Успешно: ' + participant.name + ' добавлен в бой!');
    } else {
        Alert.alert('Успешно', `${participant.name} добавлен в бой!`);
    }
  };

  const confirmDelete = (id: string, name: string) => {
    setDeleteModal({ visible: true, id, name });
  };

  const handleDelete = () => {
    if (deleteModal.id) {
      removeFromLibrary(deleteModal.id);
      setDeleteModal({ visible: false, id: null, name: '' });
    }
  };

  const renderItem = ({ item }: { item: Participant }) => (
    <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
      <View style={styles.cardContent}>
        <Text style={[styles.name, { color: theme.colors.text }]}>{item.name}</Text>
        <Text style={[styles.details, { color: theme.colors.text }]}>
          HP: {item.maxHP} | AC: {item.armorClass}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => handleAddToBattle(item)}
        >
          <Text style={styles.addButtonText}>В бой</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={() => confirmDelete(item.id, item.name)}
        >
          <Text style={styles.deleteButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
      <TextInput
        style={[styles.searchInput, { color: theme.colors.text, borderColor: theme.colors.border }]}
        placeholder="Поиск..."
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <View style={styles.sortContainer}>
        <TouchableOpacity onPress={() => setSortBy('name')}>
          <Text style={[styles.sortButton, sortBy === 'name' && styles.activeSort]}>Имя</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSortBy('level')}>
          <Text style={[styles.sortButton, sortBy === 'level' && styles.activeSort]}>Ур.</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSortBy('date')}>
          <Text style={[styles.sortButton, sortBy === 'date' && styles.activeSort]}>Дата</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {renderHeader()}
      {filteredAndSortedLibrary.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>
            {searchQuery ? 'Ничего не найдено' : 'Библиотека пуста'}
          </Text>
          {!searchQuery && (
            <Text style={[styles.subText, { color: theme.colors.text }]}>
                Импортируйте персонажей через меню "Импорт", чтобы добавить их сюда.
            </Text>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredAndSortedLibrary}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      <ConfirmationModal
        visible={deleteModal.visible}
        title="Удаление персонажа"
        message={`Вы уверены, что хотите удалить ${deleteModal.name} из библиотеки?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ ...deleteModal, visible: false })}
        confirmText="Удалить"
        cancelText="Отмена"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  sortButton: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  activeSort: {
    color: '#2196f3',
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: '#2196f3',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  cardContent: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    opacity: 0.7,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    fontSize: 18,
    color: '#f44336',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
});

