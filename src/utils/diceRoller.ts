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
  // Simple parser for NdM+K format
  const match = expression.toLowerCase().match(/^(\d+)d(\d+)([\+\-]\d+)?$/);
  
  if (match) {
    const count = parseInt(match[1]);
    const sides = parseInt(match[2]);
    const modifier = match[3] ? parseInt(match[3]) : 0;
    return rollDice(count, sides, modifier);
  }

  throw new Error('Invalid dice formula');
};

