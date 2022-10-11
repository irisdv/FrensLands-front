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
    fixBuildVal[staticBuildings[i].id - 1] = [];
    fixBuildVal[staticBuildings[i].id - 1].id = staticBuildings[i].id;
    fixBuildVal[staticBuildings[i].id - 1].type = staticBuildings[i].type;
    fixBuildVal[staticBuildings[i].id - 1].biome = staticBuildings[i].biomeId;
    fixBuildVal[staticBuildings[i].id - 1].name = staticBuildings[i].name;
    fixBuildVal[staticBuildings[i].id - 1].description =
      staticBuildings[i].description;
    fixBuildVal[staticBuildings[i].id - 1].sprite = parseResToArray(
      staticBuildings[i].spriteId
    );
    fixBuildVal[staticBuildings[i].id - 1].canMove = staticBuildings[i].canMove;
    fixBuildVal[staticBuildings[i].id - 1].canDestroy =
      staticBuildings[i].canDestroy;
    fixBuildVal[staticBuildings[i].id - 1].level = staticBuildings[i].nbLevel;
    fixBuildVal[staticBuildings[i].id - 1].needMaintain =
      staticBuildings[i].needMaintain;
    fixBuildVal[staticBuildings[i].id - 1].animated =
      staticBuildings[i].animated;
    fixBuildVal[staticBuildings[i].id - 1].pLevelToUnlock =
      staticBuildings[i].pLevelToUnlock;
    fixBuildVal[staticBuildings[i].id - 1].locked = staticBuildings[i].locked;
    fixBuildVal[staticBuildings[i].id - 1].fertility =
      staticBuildings[i].fertilityNeed;

    const _createCost = parseResToArray(staticBuildings[i].createCost);
    fixBuildVal[staticBuildings[i].id - 1].createCost = _createCost.map((val) =>
      parseInt(val)
    );

    const _repairCost = parseResToArray(staticBuildings[i].repairCost);
    fixBuildVal[staticBuildings[i].id - 1].repairCost = _repairCost.map((val) =>
      parseInt(val)
    );

    const _maintainCost = parseResToArray(staticBuildings[i].maintainCost);
    fixBuildVal[staticBuildings[i].id - 1].maintainCost = _maintainCost.map(
      (val) => parseInt(val)
    );

    const _production = parseResToArray(staticBuildings[i].production);
    fixBuildVal[staticBuildings[i].id - 1].production = _production.map((val) =>
      parseInt(val)
    );

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
    if (tempSpriteArray[1])
      fixResVal[i].harvestSprites = parseResToArray(tempSpriteArray[1]);

    const _harvestCosts = parseResToArray(staticResources[i].harvestCost);
    fixResVal[i].harvestCost = _harvestCosts.map((val) => parseInt(val));

    const _production = parseResToArray(staticResources[i].production);
    fixResVal[i].production = _production.map((val) => parseInt(val));

    i++;
  }

  return fixResVal;
};
