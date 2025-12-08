import AsyncStorage from '@react-native-async-storage/async-storage';
import { Participant } from '../types';

const BATTLE_STATE_KEY = 'rpmaster_battle_state';

export const StorageService = {
  saveBattleState: async (participants: Participant[]) => {
    try {
      const json = JSON.stringify(participants);
      await AsyncStorage.setItem(BATTLE_STATE_KEY, json);
    } catch (e) {
      console.error('Failed to save battle state', e);
    }
  },

  loadBattleState: async (): Promise<Participant[] | null> => {
    try {
      const json = await AsyncStorage.getItem(BATTLE_STATE_KEY);
      return json ? JSON.parse(json) : null;
    } catch (e) {
      console.error('Failed to load battle state', e);
      return null;
    }
  },

  clearBattleState: async () => {
    try {
      await AsyncStorage.removeItem(BATTLE_STATE_KEY);
    } catch (e) {
      console.error('Failed to clear battle state', e);
    }
  }
};

