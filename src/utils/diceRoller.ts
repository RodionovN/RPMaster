export interface RollResult {
  total: number;
  rolls: number[];
  formula: string;
  timestamp: number;
}

export const rollDice = (count: number, sides: number, modifier: number = 0): RollResult => {
  const rolls: number[] = [];
  let total = 0;

  for (let i = 0; i < count; i++) {
    const roll = Math.floor(Math.random() * sides) + 1;
    rolls.push(roll);
    total += roll;
  }

  total += modifier;

  const formula = `${count}d${sides}${modifier !== 0 ? (modifier > 0 ? `+${modifier}` : modifier) : ''}`;

  return {
    total,
    rolls,
    formula,
    timestamp: Date.now(),
  };
};

export const parseAndRoll = (expression: string): RollResult => {
  // Нормализуем строку: нижний регистр, убираем пробелы вокруг плюсов/минусов для упрощения поиска
  const norm = expression.toLowerCase();

  // 1. Ищем полную формулу вида NdM + K (или -K)
  // Примеры: "1d6+2", "2d6", "1d20-1", "2к6+3" (русская к)
  // Разрешаем пробелы между частями
  // [dк] - ищем английскую d или русскую к
  const diceRegex = /(\d+)\s*[dк]\s*(\d+)(?:\s*([\+\-])\s*(\d+))?/;
  const match = norm.match(diceRegex);
  
  if (match) {
    const count = parseInt(match[1]);
    const sides = parseInt(match[2]);
    let modifier = 0;
    
    if (match[3] && match[4]) {
      modifier = parseInt(match[4]);
      if (match[3] === '-') modifier = -modifier;
    }
    
    return rollDice(count, sides, modifier);
  }

  // 2. Ищем просто модификатор (для проверок характеристик), если это просто число с +/-
  // Пример: "+5", "-2", "5" (интерпретируем как d20+5)
  // Строгий матч, чтобы не путать с просто числами в тексте
  const modRegex = /^[\+\-]?\s*\d+$/;
  if (norm.replace(/\s/g, '').match(modRegex)) {
     const modifier = parseInt(norm.replace(/\s/g, ''));
     return rollDice(1, 20, modifier);
  }

  console.warn(`Failed to parse formula: "${expression}"`);
  throw new Error(`Invalid dice formula: ${expression}`);
};

