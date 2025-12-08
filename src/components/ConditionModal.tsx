import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { CONDITIONS, Condition } from '../utils/conditions';

interface ConditionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (conditionId: string) => void;
  activeConditions: string[];
}

export const ConditionModal: React.FC<ConditionModalProps> = ({ 
  visible, 
  onClose, 
  onSelect,
  activeConditions 
}) => {
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
            <Text style={styles.title}>Выберите состояние</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.list}>
            {CONDITIONS.map((condition) => {
              const isActive = activeConditions.includes(condition.id);
              return (
                <TouchableOpacity
                  key={condition.id}
                  style={[
                    styles.item,
                    isActive && { backgroundColor: '#e8f5e9', borderColor: '#4caf50' }
                  ]}
                  onPress={() => onSelect(condition.id)}
                >
                  <View style={styles.itemHeader}>
                    <View style={[styles.colorIndicator, { backgroundColor: condition.color }]} />
                    <Text style={[styles.itemName, isActive && styles.activeText]}>
                      {condition.name}
                    </Text>
                    {isActive && <Text style={styles.checkMark}>✓</Text>}
                  </View>
                  <Text style={styles.itemDescription}>{condition.description}</Text>
                </TouchableOpacity>
              );
            })}
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
    maxHeight: '80%',
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
  list: {
    marginBottom: 20,
  },
  item: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  activeText: {
    color: '#2e7d32',
  },
  checkMark: {
    color: '#4caf50',
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginLeft: 20,
  },
});

