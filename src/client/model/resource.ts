export interface Resource {
  id: number;
  type: string;
  spriteId: string;
  animated: boolean;
  biomeId: number;
  name: string;
  description: string;
  locked: boolean;
  size: number;
  nbHarvest: number;
  fertilityNeed: number;
  nbLevels: number;
  harvestCost: string;
  production: string;
}
