import { initMap } from "./constant";

/**
 * revComposeD
 * * Decompose land block values into an array formatted tempArray[posX][posY][param]
 *   w/ param = resType | type | id | state | blockType | blockFertility
 * ? Block composition : 11 characters
 *   1           : [resources,buildings,roads,decoration]
 *   2, 3        : [type of resources]
 *   4, 5, 6, 7  : [ID]
 *   8           : [STATE]
 *   9           : [block mat type]
 *   10, 11      : [fertility]
 * @param compMap {string}
 * @return tempArray {[]}
 */
export const revComposeD = (compMap: string, account: string): any => {
  const tempArray: any[] = [];

  let x: number = 1;
  let y: number = 1;
  let i: number = 0;
  let specIndex: number = 1; // ! THIS NEEDS TO BE GLOBAL

  tempArray[y] = [];
  const compMapSplit = compMap.split("|");

  const counters: any = [];
  counters[1] = [];
  counters[2] = [];

  while (i < compMapSplit.length) {
    if (x > 40) {
      y++;
      tempArray[y] = [];
      x = 1;
    }

    if (compMapSplit[i] === "0") {
      tempArray[y][x] = [];
      tempArray[y][x].infraType = 0;
      tempArray[y][x].type = 0;
      tempArray[y][x].id = 0;
      tempArray[y][x].state = 0;
      tempArray[y][x].blockType = 1;
      tempArray[y][x].blockFertility = 99;
    } else {
      tempArray[y][x] = [];
      tempArray[y][x].infraType = parseInt(compMapSplit[i][0]);
      tempArray[y][x].type = parseInt(compMapSplit[i][1] + compMapSplit[i][2]);
      tempArray[y][x].id = parseInt(
        compMapSplit[i][3] +
          compMapSplit[i][4] +
          compMapSplit[i][5] +
          compMapSplit[i][6]
      );
      tempArray[y][x].state = parseInt(compMapSplit[i][7]);
      tempArray[y][x].blockType = parseInt(compMapSplit[i][8]);
      tempArray[y][x].blockFertility = parseInt(
        compMapSplit[i][9] + compMapSplit[i][10]
      );
    }

    // * Additional values
    // Rand for trees and rocks
    if (tempArray[y][x].infraType === 1) {
      const type = tempArray[y][x].type;
      tempArray[y][x].randType =
        type === 1
          ? parseInt((random(specIndex, account) * (3 - 1) + 1).toFixed(0))
          : type === 2
          ? parseInt((random(specIndex, account) * (6 - 4) + 4).toFixed(0))
          : type === 3
          ? 7
          : type === 4
          ? 8
          : null;
      if (type === 1 || type === 2) specIndex++;

      // if (tempArray[y][x].type === 1) {
      //   let randomNum: number = random(specIndex, account) * (3 - 1) + 1
      //   randomNum = parseInt(randomNum.toFixed(0))
      //   tempArray[y][x].randType = randomNum
      //   specIndex++
      //   // console.log("tempArray[y][x].randType = ", tempArray[y][x].randType);
      // } else if (tempArray[y][x].type === 2) {
      //   let randomNum: number = random(specIndex, account) * (6 - 4) + 4
      //   randomNum = parseInt(randomNum.toFixed(0))
      //   tempArray[y][x].randType = randomNum
      //   specIndex++
      // } else if (tempArray[y][x].type === 3) {
      //   tempArray[y][x].randType = 7
      // } else if (tempArray[y][x].type === 4) {
      //   tempArray[y][x].randType = 8
      // }
    }

    tempArray[y][x].status = 1; // status (0: harvesting / building ongoing)
    tempArray[y][x].posX = x; // posX
    tempArray[y][x].posY = y; // posY

    // Update counters
    if (tempArray[y][x].infraType !== 0) {
      const currCounter =
        counters?.[tempArray[y][x].infraType]?.[tempArray[y][x].type] || 0;
      counters[tempArray[y][x].infraType][tempArray[y][x].type] =
        (currCounter as number) + 1;
    }

    x++;
    i++;
  }

  return { tempArray, counters };
};

/**
 * ComposeD
 * * Compose land block into string
 * @param fullMap {[]}
 * @return comp {string}
 */
export const ComposeD = (fullMap: any): string => {
  let compStr: string = "";

  let x: number = 1;
  let y: number = 1;

  while (y < 17) {
    while (x < 41) {
      if (fullMap[y][x].infraType === 0) {
        if (x === 1 && y === 1) {
          compStr = compStr + "0";
        } else {
          compStr = compStr + "|" + "0";
        }
      } else {
        let _id: string = "";
        // 4 characters for id
        if (fullMap[y][x].id < 10) {
          _id = "000" + (fullMap[y][x].id as string);
        } else if (fullMap[y][x].id < 100) {
          _id = "00" + (fullMap[y][x].id as string);
        } else if (fullMap[y][x].id < 1000) {
          _id = "0" + (fullMap[y][x].id as string);
        } else {
          _id = fullMap[y][x].id as string;
        }

        // 2 characters for type
        let _type: string = "";
        if (fullMap[y][x].type < 10) {
          _type = "0" + (fullMap[y][x].type as string);
        } else {
          _type = fullMap[y][x].type as string;
        }
        compStr =
          compStr +
          "|" +
          (fullMap[y][x].infraType as string) +
          _type +
          _id +
          (fullMap[y][x].state as string) +
          (fullMap[y][x].blockType as string) +
          (fullMap[y][x].blockFertility as string);
      }
      x++;
    }
    x = 1;
    y++;
  }

  console.log("Composition = ", compStr);
  return compStr;
};

export const random = (spec: number, account: string): number => {
  const x = Math.sin(seedFromWallet(account) + spec) * 10000;
  return x - Math.floor(x);
};

export const seedFromWallet = (wallet: string): number => {
  let i: number = 3;
  let seed: number = 0;
  let seedStr: string = "";

  while (i < 20) {
    seedStr = seedStr + wallet[i].charCodeAt(0).toString();
    i = i + 3;
  }

  seed = parseInt(seedStr);
  return seed;
};

/**
 * generateFullMap
 * * Generate all map information on initialization
 * @return fullMap {[]}
 */
export const generateFullMap = (): string => {
  let fullMap: string = "";
  let i: number = 1;
  let j: number = 0;
  let uid: number = 1;

  const tree: any[] = [
    48, 64, 84, 87, 91, 95, 99, 103, 106, 113, 126, 128, 129, 130, 133, 134,
    143, 144, 147, 148, 149, 150, 152, 154, 163, 164, 165, 168, 171, 184, 185,
    189, 190, 191, 196, 204, 205, 207, 210, 211, 216, 218, 223, 225, 226, 227,
    228, 230, 231, 232, 236, 243, 244, 249, 250, 253, 256, 257, 258, 265, 266,
    267, 268, 271, 277, 284, 287, 294, 301, 308, 309, 311, 313, 316, 323, 325,
    327, 329, 330, 331, 348, 350, 352, 353, 354, 357, 366, 371, 373, 376, 382,
    391, 392, 394, 395, 403, 404, 407, 408, 409, 410, 412, 414, 421, 424, 426,
    427, 432, 434, 444, 446, 448, 449, 450, 451, 452, 456, 459, 469, 471, 473,
    475, 485, 488, 489, 502, 507, 510, 525, 528, 533, 536, 540, 545, 557, 562,
    566, 571, 577, 584, 591, 595,
  ];
  const rock: any[] = [
    53, 66, 68, 85, 89, 122, 162, 166, 173, 181, 234, 312, 315, 328, 339, 345,
    359, 367, 368, 369, 436, 439, 514, 526, 537, 538, 550, 589,
  ];
  const bush: any[] = [
    92, 111, 145, 151, 169, 187, 201, 229, 246, 248, 272, 274, 288, 291, 293,
    305, 364, 411, 429, 477, 482, 492, 494, 495, 552,
  ];
  const mine: any[] = [93, 286, 314, 484];

  while (i <= 640) {
    let infraType: string = "1";
    let resType: string = "";
    let tempUID: any = "0";
    let state: string = "1";
    let matType: string = "1";
    let fertility: string = "99";

    while (j < rock.length) {
      if (i === rock[j]) {
        resType = "02";
      }
      j++;
    }
    j = 0;

    while (j < bush.length) {
      if (i === bush[j]) {
        resType = "03";
      }
      j++;
    }
    j = 0;

    while (j < tree.length) {
      if (i === tree[j]) {
        resType = "01";
      }
      j++;
    }
    j = 0;

    while (j < mine.length) {
      if (i === mine[j]) {
        resType = "04";
      }
      j++;
    }
    j = 0;

    if (i === 300) {
      console.log("in condition 300");
      infraType = "2";
      resType = "01";
      tempUID = "0001";
    }

    if (resType === "") {
      tempUID = "0";
      fertility = "0";
      infraType = "0";
      matType = "0";
      state = "0";
    } else if (infraType === "1") {
      tempUID = uid.toString();
      if (uid < 10) {
        tempUID = "000" + uid.toString();
      } else if (uid >= 10 && uid < 100) {
        tempUID = "00" + uid.toString();
      } else if (uid >= 100) {
        tempUID = "0" + uid.toString();
      }
      uid++;
    }

    fullMap =
      fullMap +
      parseInt(
        infraType + resType + (tempUID as string) + state + matType + fertility
      ).toString() +
      "|";

    i++;
  }
  return fullMap;
};

/**
 * calculatePlayerLevel
 * * calculate the level of a player
 * @param currLevel {number} player current level
 * @param mapBuildingArray {[]} array of buildings built by the player
 * @param counters {[]} array of buildings counters
 * @return level {number} updated level number
 */
export const calculatePlayerLevel = (
  mapBuildingArray: any[],
  counters: any[]
): number => {
  let _level: number = 1;
  const cabin = mapBuildingArray.find(
    (building) => typeof building === "object" && building.type === 1
  );
  _level = cabin && cabin?.decay === 0 ? 2 : _level;
  _level = counters?.[2]?.[2] > 0 && counters?.[2]?.[14] > 0 ? 3 : _level;
  _level = counters?.[2]?.[18] > 0 ? 4 : _level;
  _level = counters?.[2]?.[5] > 0 && counters?.[2]?.[6] > 0 ? 5 : _level;
  _level = counters?.[2]?.[9] > 0 && counters?.[2]?.[7] > 0 ? 6 : _level;
  _level = counters?.[2]?.[19] > 0 ? 7 : _level;
  _level = counters?.[2]?.[3] > 0 ? 8 : _level;
  _level =
    counters?.[2]?.[4] > 0 &&
    counters?.[2]?.[8] > 0 &&
    counters?.[2]?.[10] > 0 &&
    counters?.[2]?.[11] > 0 &&
    counters?.[2]?.[12] > 0 &&
    counters?.[2]?.[13] > 0 &&
    counters?.[2]?.[15] > 0 &&
    counters?.[2]?.[16] > 0 &&
    counters?.[2]?.[17] > 0 &&
    counters?.[2]?.[20] > 0 &&
    counters?.[2]?.[21] > 0 &&
    counters?.[2]?.[22] > 0 &&
    counters?.[2]?.[23] > 0
      ? 9
      : _level;
  return _level;
};

export const initMapArr = (account: string): any[] => {
  const tempArray: any[] = [];

  let x: number = 1;
  let y: number = 1;
  let i: number = 0;
  let specIndex: number = 1;

  tempArray[y] = [];
  const compMapSplit = initMap.split("|");

  const counters: any = [];
  counters[1] = [];
  counters[2] = [];

  while (i < compMapSplit.length) {
    if (x > 40) {
      y++;
      tempArray[y] = [];
      x = 1;
    }

    if (compMapSplit[i] === "0") {
      tempArray[y][x] = [];
      tempArray[y][x].infraType = 0;
      tempArray[y][x].type = 0;
      tempArray[y][x].id = 0;
      tempArray[y][x].state = 0;
      tempArray[y][x].blockType = 1;
      tempArray[y][x].blockFertility = 99;
    } else {
      tempArray[y][x] = [];
      tempArray[y][x].infraType = parseInt(compMapSplit[i][0]);
      tempArray[y][x].type = parseInt(compMapSplit[i][1] + compMapSplit[i][2]);
      tempArray[y][x].id = parseInt(
        compMapSplit[i][3] +
          compMapSplit[i][4] +
          compMapSplit[i][5] +
          compMapSplit[i][6]
      );
      tempArray[y][x].state = parseInt(compMapSplit[i][7]);
      tempArray[y][x].blockType = parseInt(compMapSplit[i][8]);
      tempArray[y][x].blockFertility = parseInt(
        compMapSplit[i][9] + compMapSplit[i][10]
      );
    }

    // * Additional values
    // Rand for trees and rocks

    if (tempArray[y][x].infraType === 1) {
      const type = tempArray[y][x].type;
      tempArray[y][x].randType =
        type === 1
          ? parseInt((random(specIndex, account) * (3 - 1) + 1).toFixed(0))
          : type === 2
          ? parseInt((random(specIndex, account) * (6 - 4) + 4).toFixed(0))
          : type === 3
          ? 7
          : type === 4
          ? 8
          : null;
      if (type === 1 || type === 2) specIndex++;
    }

    tempArray[y][x].posX = x; // posX
    tempArray[y][x].posY = y; // posY

    x++;
    i++;
  }

  return tempArray;
};

// @notice decompose map received from chain
export const composeFromChain = (mapFromChain: any, account: string): any => {
  const res = [];
  let specIndex: number = 1;
  let x = 1;
  let y = 1;
  res[y] = [];

  const counters: any = [];
  counters[1] = [];
  counters[2] = [];

  for (let i = 0; i < mapFromChain.length; i++) {
    if (x > 40) {
      y++;
      res[y] = [] as any;
      x = 1;
    }
    const temp = Number(mapFromChain[i]);
    const block: any[any] = [];

    if (temp === 0) {
      block.infraType = 0;
      block.type = 0;
      block.id = 0;
      block.state = 0;
      block.blockType = 1;
      block.blockFertility = 99;
    } else {
      const tempStr = temp.toString();
      block.infraType = parseInt(tempStr[0]);
      block.type = parseInt(tempStr[1] + tempStr[2]);
      block.id = parseInt(tempStr[3] + tempStr[4] + tempStr[5] + tempStr[6]);
      block.state = parseInt(tempStr[7]);
      block.blockType = parseInt(tempStr[8]);
      block.blockFertility = parseInt(tempStr[9] + tempStr[10]);
    }

    // generate trees
    if (block.infraType === 1) {
      const type = block.type;
      block.randType =
        type === 1
          ? parseInt((random(specIndex, account) * (3 - 1) + 1).toFixed(0))
          : type === 2
          ? parseInt((random(specIndex, account) * (6 - 4) + 4).toFixed(0))
          : type === 3
          ? 7
          : type === 4
          ? 8
          : null;
      if (type === 1 || type === 2) specIndex++;
    }

    block.status = 1; // status (0: harvesting / building ongoing)
    block.posX = x; // posX
    block.posY = y; // posY

    if (block.infraType !== 0) {
      const currCounter =
        (counters?.[block.infraType]?.[block.type] as number) || 0;
      counters[block.infraType][block.type] = currCounter + 1;
    }

    res[y][x] = block;
    x++;
  }
  return { res, counters };
};

export const composeFromIndexer = (
  mapFromIndexer: string[],
  account: string
): any => {
  const res: any[] = [];
  let specIndex: number = 1;

  const counters: any = [];
  counters[1] = [];
  counters[2] = [];

  for (let i = 0; i < 16; i++) {
    res[i + 1] = [];

    for (let j = 0; j < 40; j++) {
      const block: any[any] = [];

      if (mapFromIndexer[i][j] === "0") {
        block.infraType = 0;
        block.type = 0;
        block.id = 0;
        block.state = 0;
        block.blockType = 1;
        block.blockFertility = 99;
      } else {
        block.infraType = parseInt(mapFromIndexer[i][j][0]);
        block.type = parseInt(
          mapFromIndexer[i][j][1] + mapFromIndexer[i][j][2]
        );
        block.id = parseInt(
          mapFromIndexer[i][j][3] +
            mapFromIndexer[i][j][4] +
            mapFromIndexer[i][j][5] +
            mapFromIndexer[i][j][6]
        );
        block.state = parseInt(mapFromIndexer[i][j][7]);
        block.blockType = parseInt(mapFromIndexer[i][j][8]);
        block.blockFertility = parseInt(
          mapFromIndexer[i][j][9] + mapFromIndexer[i][j][10]
        );
      }

      if (block.infraType === 1) {
        const type = block.type;
        block.randType =
          type === 1
            ? parseInt((random(specIndex, account) * (3 - 1) + 1).toFixed(0))
            : type === 2
            ? parseInt((random(specIndex, account) * (6 - 4) + 4).toFixed(0))
            : type === 3
            ? 7
            : type === 4
            ? 8
            : null;
        if (type === 1 || type === 2) specIndex++;
      }
      block.status = 1; // status (0: harvesting / building ongoing)
      block.posX = j + 1; // posX
      block.posY = i + 1; // posY

      if (block.infraType !== 0) {
        const currCounter =
          (counters?.[block.infraType]?.[block.type] as number) || 0;
        counters[block.infraType][block.type] = currCounter + 1;
      }

      res[i + 1][j + 1] = block;
    }
  }
  return { res, counters };
};
