export interface Building {
  id: number;
  type: string;
  spriteId: string;
  name: string;
  description: string;
  pLevelToUnlock: number;
  locked: boolean;
  size: number;
  canDestroy: boolean;
  canMove: boolean;
  canProduce: boolean;
  fertilityNeed?: number;
  nbLevels: number;
  needMaintain: boolean;
  createCost: string;
  maintainCost: string;
  repairCost: string;
  production: string;
  destroy: string;
}
