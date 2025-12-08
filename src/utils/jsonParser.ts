import { Participant, Attack, Stat, Skill } from '../types';
import { parseFeats } from './proseMirrorParser';

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

    // Парсинг атак
    const attacks: Attack[] = [];
    if (charData.weaponsList && Array.isArray(charData.weaponsList)) {
      charData.weaponsList.forEach((w: any) => {
        if (w.name?.value) {
          attacks.push({
            name: w.name.value,
            damage: w.dmg?.value || '',
            modifier: w.mod?.value || '',
          });
        }
      });
    }

    // Парсинг способностей (feats)
    const abilities = parseFeats(charData.text?.feats);

    // Парсинг характеристик (stats)
    const stats: Stat[] = [];
    if (charData.stats) {
      Object.keys(charData.stats).forEach(key => {
        const stat = charData.stats[key];
        if (stat) {
          stats.push({
            name: stat.label || key.toUpperCase(),
            value: stat.score || 10,
            modifier: stat.modifier || 0
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

