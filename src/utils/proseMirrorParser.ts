// Простой парсер для извлечения текста из структуры ProseMirror
export const parseProseMirror = (node: any): string => {
  if (!node) return '';
  
  if (node.type === 'text') {
    return node.text || '';
  }

  if (node.content && Array.isArray(node.content)) {
    return node.content.map(parseProseMirror).join('\n');
  }

  return '';
};

// Парсер специально для способностей Long Story Short, где заголовки часто жирным
export const parseFeats = (featsData: any): { name: string, description: string }[] => {
  const abilities: { name: string, description: string }[] = [];
  
  if (!featsData?.value?.data?.content) return abilities;

  const content = featsData.value.data.content;
  
  let currentAbility = { name: 'Способность', description: '' };
  let isNew = true;

  content.forEach((node: any) => {
    if (node.type === 'paragraph') {
      const text = parseProseMirror(node);
      
      // Эвристика: если параграф начинается с жирного текста и короток - это заголовок
      const isHeader = node.content?.[0]?.marks?.some((m: any) => m.type === 'bold');
      
      if (isHeader) {
        if (!isNew && currentAbility.description) {
          abilities.push({ ...currentAbility });
        }
        // Очищаем имя от двоеточия в конце, если есть
        const name = text.replace(/[:\.]\s*$/, '');
        currentAbility = { name, description: '' };
        isNew = false;
      } else {
        currentAbility.description += (currentAbility.description ? '\n' : '') + text;
      }
    }
  });

  if (currentAbility.description) {
    abilities.push(currentAbility);
  }

  return abilities;
};

