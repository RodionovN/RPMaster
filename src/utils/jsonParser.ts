import { Participant, Attack, Stat, Skill } from '../types';
import { parseFeats } from './proseMirrorParser';
import { calculateModifier, SKILL_STAT_MAP } from './dndUtils';

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
    const proficiencyBonus = parseInt(charData.proficiency?.value) || 2; // Бонус мастерства
    
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
        try {
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
        } catch (e) {
            console.warn('Error parsing weapon:', w, e);
        }
      });
    }

    // Парсинг способностей (feats)
    const abilities = parseFeats(charData.text?.feats);

    // Парсинг навыков (skills)
    const skills: Skill[] = [];
    if (charData.skills) {
      Object.keys(charData.skills).forEach(key => {
        const skillData = charData.skills[key];
        
        if (skillData) {
           const skillName = skillData.label || key;
           const normalizedKey = key.toLowerCase().replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase(); // camelCase -> space separated
           
           // 1. Ищем базовую характеристику
           const statKey = SKILL_STAT_MAP[normalizedKey] || SKILL_STAT_MAP[skillName.toLowerCase()];
           const statMod = statKey ? (statsMap[statKey] || 0) : 0;

           // 2. Проверяем владение (isProf) или экспертизу (isExpertise - если есть в формате LSS)
           const isProf = skillData.isProf; 
           // В LSS иногда бывает expertise как отдельный флаг или уровень владения
           
           // 3. Считаем итоговый модификатор
           // Если есть customModifier, используем его, иначе считаем сами
           let finalMod = statMod;
           if (isProf) finalMod += proficiencyBonus;
           
           // Перезаписываем, если есть явный customModifier, который не равен 0 (обычно он перекрывает авторасчет)
           if (skillData.customModifier) {
               // Но иногда customModifier - это просто бонус сверху. В LSS это обычно ИТОГОВЫЙ бонус? 
               // Чаще всего в JSON LSS customModifier это бонус КРОМЕ стата. 
               // Но для надежности, если мы не уверены в структуре LSS до конца,
               // лучше довериться явному customModifier, если он похож на полный мод.
               // Однако безопаснее использовать стандартную формулу 5e.
           }

           skills.push({
             name: skillName,
             modifier: finalMod
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

