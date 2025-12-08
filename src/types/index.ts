export interface Participant {
  id: string;
  name: string;
  maxHP: number;
  currentHP: number;
  armorClass: number;
  initiative?: number;
  conditions?: string[];
}

export interface Player extends Participant {
  class?: string;
  level?: number;
}

export interface Monster extends Participant {
  type?: string;
}

