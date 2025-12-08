import { Participant } from '../types';

export const parseCharacterJson = (jsonContent: string): Participant | null => {
  try {
    const root = JSON.parse(jsonContent);
    // Проверяем, если данные внутри поля "data" (как в примере Long Story Short)
    let charData = root;
    if (typeof root.data === 'string') {
      try {
        charData = JSON.parse(root.data);
      } catch (e) {
        console.warn('Failed to parse inner data string, trying root object');
      }
    }

    // Извлечение данных с учетом структуры Long Story Short
    const name = charData.name?.value || 'Неизвестный';
    const hpMax = parseInt(charData.vitality?.['hp-max']?.value) || 10;
    const hpCurrent = parseInt(charData.vitality?.['hp-current']?.value) || hpMax;
    const ac = parseInt(charData.vitality?.ac?.value) || 10;
    
    // Генерируем уникальный ID
    const id = Date.now().toString();

    return {
      id,
      name,
      maxHP: hpMax,
      currentHP: hpCurrent,
      armorClass: ac,
    };
  } catch (error) {
    console.error('JSON Parse Error:', error);
    return null;
  }
};

