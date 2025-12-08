import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, ActivityIndicator, Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useBattle } from '../context/BattleContext';
import { parseCharacterJson } from '../utils/jsonParser';
import { Participant } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Import'>;

export const ImportScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { addParticipant } = useBattle();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<Participant | null>(null);

  const handlePickDocument = async () => {
    try {
      setLoading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        setLoading(false);
        return;
      }

      const asset = result.assets[0];
      let fileContent: string;

      try {
        if (Platform.OS === 'web') {
          // Для веб-версии читаем через fetch
          const response = await fetch(asset.uri);
          fileContent = await response.text();
        } else {
          // Для нативной версии читаем через FileSystem
          fileContent = await FileSystem.readAsStringAsync(asset.uri);
        }
      } catch (readError) {
        console.error('File read error:', readError);
        Alert.alert('Ошибка чтения', 'Не удалось прочитать файл. ' + (readError as Error).message);
        setLoading(false);
        return;
      }

      console.log('File content length:', fileContent.length); // Debug log
      const participant = parseCharacterJson(fileContent);

      if (participant) {
        setPreview(participant);
      } else {
        Alert.alert('Ошибка формата', 'Не удалось распознать структуру файла JSON. Убедитесь, что это файл персонажа Long Story Short.');
      }
    } catch (error) {
      console.error('Import error:', error);
      Alert.alert('Ошибка', 'Произошла ошибка при импорте: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = () => {
    if (preview) {
      addParticipant(preview);
      Alert.alert('Успех', `${preview.name} добавлен в бой!`, [
        { text: 'ОК', onPress: () => navigation.navigate('Battle') }
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Импорт персонажа</Text>
      <Text style={styles.subtitle}>Поддерживается формат Long Story Short JSON</Text>

      <View style={styles.buttonContainer}>
        <Button title="Выбрать файл" onPress={handlePickDocument} disabled={loading} />
      </View>

      {loading && <ActivityIndicator size="large" color="#2196f3" style={styles.loader} />}

      {preview && (
        <View style={styles.preview}>
          <Text style={styles.previewTitle}>Предпросмотр:</Text>
          <Text style={styles.previewText}>Имя: {preview.name}</Text>
          <Text style={styles.previewText}>HP: {preview.currentHP}/{preview.maxHP}</Text>
          <Text style={styles.previewText}>AC: {preview.armorClass}</Text>
          
          <View style={styles.actionButtons}>
            <Button title="Добавить в бой" onPress={handleImport} color="#4caf50" />
            <View style={{ height: 10 }} />
            <Button title="Отмена" onPress={() => setPreview(null)} color="#f44336" />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 32,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    marginBottom: 20,
  },
  loader: {
    marginTop: 20,
  },
  preview: {
    width: '100%',
    maxWidth: 300,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  previewText: {
    fontSize: 16,
    marginBottom: 4,
    color: '#444',
  },
  actionButtons: {
    marginTop: 20,
  },
});

