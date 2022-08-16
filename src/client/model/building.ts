export interface Resource {
    id: number;
    qty: number;
  }
  
export interface Cost {
    level: number;
    resources: Resource[]
    frensCoins: number;
    energy: number;
    pop_min?: number;
    new_pop?: number;
}
  
export interface Building {
    id: number;
    name: string;
    category: string;
    description: string;
    level: number;
    cost_update?: Cost[];
    daily_cost?: Cost[];
    daily_harvest?: Cost[];

}