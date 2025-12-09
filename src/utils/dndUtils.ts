export const calculateModifier = (score: number): number => {
  return Math.floor((score - 10) / 2);
};

export const SKILL_STAT_MAP: Record<string, string> = {
  'athletics': 'str',
  'acrobatics': 'dex',
  'sleight of hand': 'dex',
  'stealth': 'dex',
  'arcana': 'int',
  'history': 'int',
  'investigation': 'int',
  'nature': 'int',
  'religion': 'int',
  'animal handling': 'wis',
  'insight': 'wis',
  'medicine': 'wis',
  'perception': 'wis',
  'survival': 'wis',
  'deception': 'cha',
  'intimidation': 'cha',
  'performance': 'cha',
  'persuasion': 'cha',
};

