export interface Attack {
  name: string;
  damage: string;
  modifier: string;
}

export interface Ability {
  name: string;
  description: string;
}

export interface Stat {
  name: string;
  value: number;
  modifier: number;
}

export interface Skill {
  name: string;
  modifier: number;
}

export interface Participant {
  id: string;
  name: string;
  maxHP: number;
  currentHP: number;
  armorClass: number;
  initiative?: number;
  conditions?: string[];
  attacks?: Attack[];
  abilities?: Ability[];
  stats?: Stat[];
  skills?: Skill[];
}

export interface Player extends Participant {
  class?: string;
  level?: number;
}

export interface Monster extends Participant {
  type?: string;
}

