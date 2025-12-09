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
  // Remove all spaces and convert to lowercase
  const cleanExpression = expression.replace(/\s/g, '').toLowerCase();
  
  // Regex to match NdM (+/-) K
  const match = cleanExpression.match(/^(\d+)d(\d+)([\+\-]\d+)?$/);
  
  if (match) {
    const count = parseInt(match[1]);
    const sides = parseInt(match[2]);
    const modifier = match[3] ? parseInt(match[3]) : 0;
    return rollDice(count, sides, modifier);
  }

  // Support just modifier (e.g. "+5" or "-2" -> 1d20+5) - often used for checks
  const modMatch = cleanExpression.match(/^([\+\-]?\d+)$/);
  if (modMatch) {
     const modifier = parseInt(modMatch[1]);
     return rollDice(1, 20, modifier);
  }

  throw new Error(`Invalid dice formula: ${expression}`);
};

