import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Participant } from '../types';
import { ParticipantCard } from './ParticipantCard';

interface ParticipantListProps {
  participants: Participant[];
  onRemoveParticipant?: (id: string) => void;
}

export const ParticipantList: React.FC<ParticipantListProps> = ({ participants, onRemoveParticipant }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={participants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ParticipantCard 
            participant={item} 
            onRemove={onRemoveParticipant} 
          />
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingBottom: 16,
  },
});

