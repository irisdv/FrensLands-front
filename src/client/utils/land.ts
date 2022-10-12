// TODO Recompose fullMap from local fullMapArray

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
export const revComposeD = (compMap: string) => {
  const tempArray: any[] = [];

  let x: number = 1;
  let y: number = 1;
  let i: number = 0;
  var specIndex: number = 1; // ! THIS NEEDS TO BE GLOBAL

  tempArray[y] = [];
  const compMapSplit = compMap.split("|");

  while (i < compMapSplit.length) {
    if (x > 40) {
      y++;
      tempArray[y] = [];
      x = 1;
    }

    if (compMapSplit[i] == "0") {
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

    if (tempArray[y][x].infraType == 1) {
      if (tempArray[y][x].type == 1) {
        var randomNum: number = random(specIndex) * (3 - 1) + 1;
        randomNum = parseInt(randomNum.toFixed(0));
        tempArray[y][x].randType = randomNum;
        specIndex++;
        //console.log("tempArray[y][x].randType = ", tempArray[y][x].randType);
      } else if (tempArray[y][x].type == 2) {
        var randomNum: number = random(specIndex) * (6 - 4) + 4;
        randomNum = parseInt(randomNum.toFixed(0));
        tempArray[y][x].randType = randomNum;
        specIndex++;
      } else if (tempArray[y][x].type == 3) {
        tempArray[y][x].randType = 7;
      } else if (tempArray[y][x].type == 4) {
        tempArray[y][x].randType = 8;
      }
    }

    tempArray[y][x].status = 1; // status (0: harvesting / building ongoing)
    tempArray[y][x].posX = x; // posX
    tempArray[y][x].posY = y; // posY

    x++;
    i++;
  }
  return tempArray;
};


export const ComposeD = (fullMap: any) => {
  
  let compStr: string = "";

  let x: number = 1;
  let y: number = 1;
  let i: number = 0;

  while (y < 17)
  {
    while (x < 41)
    {
      if (fullMap[y][x].type == 0)
      {
        compStr = compStr + "|" + "0";
      }
      else
      {
        compStr = compStr + "|" + fullMap[y][x].infraType + fullMap[y][x].type + fullMap[y][x].id + fullMap[y][x].state +
                    fullMap[y][x].blockType + fullMap[y][x].blockFertility;
      }
      x++;
    }
    x = 1;
    y++;
  }

  console.log("Composition = ", compStr);
  return (compStr);
};



export const random = (spec: number) => {
  // ! USE CLIENT'S WALLET
  var x =
    Math.sin(
      seedFromWallet(
        "0x00a7a315c7463b4bc491239e1d995fe736fe4830d3345d109a25182fb918ddd2"
      ) + spec
    ) * 10000;

  return x - Math.floor(x);
};

export const seedFromWallet = (wallet: string) => {
  var i: number = 3;
  var seed: number = 0;
  var seedStr: string = "";

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
export const generateFullMap = () => {
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
      if (i == rock[j]) {
        resType = "02";
      }
      j++;
    }
    j = 0;

    while (j < bush.length) {
      if (i == bush[j]) {
        resType = "03";
      }
      j++;
    }
    j = 0;

    while (j < tree.length) {
      if (i == tree[j]) {
        resType = "01";
      }
      j++;
    }
    j = 0;

    while (j < mine.length) {
      if (i == mine[j]) {
        resType = "04";
      }
      j++;
    }
    j = 0;

    if (i == 300) {
      console.log("in condition 300");
      infraType = "2";
      resType = "01";
      tempUID = "0001";
    }

    if (resType == "") {
      tempUID = "0";
      fertility = "0";
      infraType = "0";
      matType = "0";
      state = "0";
    } else if (infraType == "1") {
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
        infraType.toString() +
          resType.toString() +
          tempUID.toString() +
          state.toString() +
          matType.toString() +
          fertility.toString()
      ).toString() +
      "|";

    i++;
  }
  return fullMap;
};
