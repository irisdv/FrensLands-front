import { parseResToArray, parsePipeResToArray } from "./utils";

/**
 * fillStaticBuildings
 * @param staticBuildings {[]}
 * @return fixBuildVal {[]}
 */
export const fillStaticBuildings = (staticBuildings: any) => {
  let i = 0;
  const fixBuildVal: any[] = [];

  while (i < staticBuildings.length) {
    fixBuildVal[i] = [];
    fixBuildVal[i].id = staticBuildings[i].id;
    fixBuildVal[i].type = staticBuildings[i].type;
    fixBuildVal[i].biome = staticBuildings[i].biomeId;
    fixBuildVal[i].name = staticBuildings[i].name;
    fixBuildVal[i].description = staticBuildings[i].description;
    fixBuildVal[i].sprite = parseResToArray(staticBuildings[i].spriteId);
    fixBuildVal[i].canMove = staticBuildings[i].canMove;
    fixBuildVal[i].canDestroy = staticBuildings[i].canDestroy;
    fixBuildVal[i].level = staticBuildings[i].nbLevel;
    fixBuildVal[i].needMaintain = staticBuildings[i].needMaintain;
    fixBuildVal[i].animated = staticBuildings[i].animated;
    fixBuildVal[i].pLevelToUnlock = staticBuildings[i].pLevelToUnlock;
    fixBuildVal[i].locked = staticBuildings[i].locked;
    fixBuildVal[i].fertility = staticBuildings[i].fertilityNeed;

    const _createCost = parseResToArray(staticBuildings[i].createCost);
    fixBuildVal[i].createCost = _createCost.map((val) => parseInt(val));

    const _repairCost = parseResToArray(staticBuildings[i].repairCost);
    fixBuildVal[i].repairCost = _repairCost.map((val) => parseInt(val));

    const _maintainCost = parseResToArray(staticBuildings[i].maintainCost);
    fixBuildVal[i].maintainCost = _maintainCost.map((val) => parseInt(val));

    const _production = parseResToArray(staticBuildings[i].production);
    fixBuildVal[i].production = _production.map((val) => parseInt(val));

    i++;
  }

  return fixBuildVal;
};

/**
 * fillStaticResources
 * @param staticResources {[]}
 * @return fixResVal {[]}
 */
export const fillStaticResources = (staticResources: any) => {
  let i = 0;
  const fixResVal: any[] = [];

  while (i < staticResources.length) {
    let tempSpriteArray: any[] = [];
    tempSpriteArray = parsePipeResToArray(staticResources[i].spriteId);

    fixResVal[i] = [];
    fixResVal[i].id = staticResources[i].id;
    fixResVal[i].biome = staticResources[i].biomeId;
    fixResVal[i].name = staticResources[i].name;
    fixResVal[i].description = staticResources[i].description;
    fixResVal[i].type = staticResources[i].type;
    fixResVal[i].nbHarvest = staticResources[i].nbHarvest;
    fixResVal[i].animated = staticResources[i].animated;
    fixResVal[i].locked = staticResources[i].locked;
    fixResVal[i].size = staticResources[i].size;
    fixResVal[i].level = staticResources[i].nbLevels;
    fixResVal[i].fertility = staticResources[i].fertilityNeed;
    fixResVal[i].sprites = parseResToArray(tempSpriteArray[0]);
    fixResVal[i].harvestSprites = parseResToArray(tempSpriteArray[1]);

    const _harvestCosts = parseResToArray(staticResources[i].harvestCost);
    fixResVal[i].harvestCost = _harvestCosts.map((val) => parseInt(val));

    const _production = parseResToArray(staticResources[i].production);
    fixResVal[i].production = _production.map((val) => parseInt(val));

    i++;
  }

  return fixResVal;
};
