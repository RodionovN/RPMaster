import { Participant, Attack, Stat, Skill } from '../types';
import { parseFeats } from './proseMirrorParser';
import { calculateModifier } from './dndUtils';

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

    // Парсинг характеристик (stats)
    const stats: Stat[] = [];
    const statsMap: Record<string, number> = {}; // Для быстрого поиска модификаторов

    if (charData.stats) {
      Object.keys(charData.stats).forEach(key => {
        const stat = charData.stats[key];
        if (stat) {
          const value = stat.score || 10;
          const modifier = calculateModifier(value); // Пересчитываем модификатор всегда для надежности
          
          stats.push({
            name: stat.label || key.toUpperCase(),
            value: value,
            modifier: modifier
          });
          
          // Сохраняем модификатор по ключу (например, 'str', 'dex')
          statsMap[key.toLowerCase()] = modifier;
        }
      });
    }

    // Парсинг атак
    const attacks: Attack[] = [];
    if (charData.weaponsList && Array.isArray(charData.weaponsList)) {
      charData.weaponsList.forEach((w: any) => {
        if (w.name?.value) {
          let mod = w.mod?.value || '';
          
          // Проверяем, является ли модификатор ссылкой на характеристику
          if (mod && typeof mod === 'string' && statsMap[mod.toLowerCase()] !== undefined) {
             const val = statsMap[mod.toLowerCase()];
             mod = val >= 0 ? `+${val}` : `${val}`;
          }

          attacks.push({
            name: w.name.value,
            damage: w.dmg?.value || '',
            modifier: mod,
          });
        }
      });
    }

    // Парсинг навыков (skills)
    const skills: Skill[] = [];
    if (charData.skills) {
      Object.keys(charData.skills).forEach(key => {
        const skill = charData.skills[key];
        // Если есть isProf (владение), добавляем
        // Или добавляем все? Лучше все, но сортировать потом.
        // Пока добавим те, где есть владение или модификатор отличен от базового
        if (skill) {
           skills.push({
             name: skill.label || key,
             modifier: skill.customModifier || 0 // Тут сложнее расчет в LSS, но пока так
           });
        }
      });
    }

    return {
      id,
      name,
      maxHP: hpMax,
      currentHP: hpCurrent,
      armorClass: ac,
      attacks,
      abilities,
      stats,
      skills,
    };
  } catch (error) {
    console.error('JSON Parse Error:', error);
    return null;
  }
};

