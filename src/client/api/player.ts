// export default const getUserInfo = async (account: string) => {
export default async function getPlayer(account: string) {
  fetch("http://localhost:3001/api/users/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ account }),
  })
    .then(async (response) => {
      return await response.json();
    })
    .then((data) => {
      console.log(
        "userData received, ready to initialize game session withat data : ",
        data
      );
    });
}

/**
 * buildAction
 * * Update after player built
 * @param account {string}
 * @param entrypoint {string} in contract
 * @param calldata {string}
 * @param inventory {[]} updated player inventory
 * @param newBuilding {[]} building data
 * @return success
 */
// TODO add fullMap composed in string
export const buildAction = (
  account: string,
  entrypoint: string,
  calldata: string,
  inventory: any,
  newBuilding: any
) => {
  fetch("http://localhost:3001/api/users/build", {
    method: "POST",
    headers: {
      "x-access-token": localStorage.getItem("user") as string,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      account: account,
      action: {
        entrypoint: entrypoint,
        calldata: calldata,
      },
      inventory: inventory,
      newBuilding: {
        type: newBuilding["type"],
        gameUid: newBuilding["gameUid"],
        blockX: newBuilding["blockX"],
        blockY: newBuilding["blockY"],
        posX: newBuilding["posX"],
        posY: newBuilding["posY"],
        decay: newBuilding["decay"],
      },
    }),
  })
    .then(async (response) => await response.json())
    .then((data) => {
      console.log("build Action was stored in DB successfully", data);
      return data;
    })
    .catch((error) => {
      console.log("error while storing harvest action in DB", error);
    });
};

/**
 * harvestAction
 * * Update after player built
 * @param account {[]} player wallet address
 * @param entrypoint {string} in contract
 * @param calldata {string}
 * @param inventory {[]} updated player inventory
 * @return success
 */
// TODO translated fullMap into string and add in request
export const harvestAction = (
  account: string,
  entrypoint: string,
  calldata: string,
  inventory: any
) => {
  fetch("http://localhost:3001/api/users/harvest", {
    method: "POST",
    headers: {
      "x-access-token": localStorage.getItem("user") as string,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      account: account,
      action: {
        entrypoint: entrypoint,
        calldata: calldata,
      },
      inventory: inventory,
    }),
  })
    .then(async (response) => await response.json())
    .then((data) => {
      console.log("harvest Action was stored in DB successfully", data);
      return data;
    })
    .catch((error) => {
      console.log("error while storing harvest action in DB", error);
    });
};

/**
 * storeAction
 * * Add action in player actions table
 * @param account {[]} player wallet address
 * @param entrypoint {string} in contract
 * @param calldata {string}
 * @return success
 */
export const storeAction = async (
  account: string,
  entrypoint: string,
  calldata: string
) => {
  fetch("http://localhost:3001/api/player_action", {
    method: "POST",
    headers: {
      "x-access-token": localStorage.getItem("user") as string,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      account: account,
      action: {
        entrypoint: entrypoint,
        calldata: calldata,
      },
    }),
  })
    .then(async (response) => {
      return await response.json();
    })
    .then((data) => {
      console.log("action was stored in DB successfully", data);
    });
};

// const getUserSettings = async (account: string) => {
//   await fetch(`http://localhost:3001/api/users/${account}`, {
//     headers: { "x-access-token": localStorage.getItem("user") as string },
//   })
//     .then(async (response) => {
//       return await response.json();
//     })
//     .then((data) => {
//       console.log("data of player retrieved", data);
//       if (data) {
//         initSettings(data.setting);
//         // Init player new game session
//         initGameSession(
//           data.inventory,
//           data.land,
//           data.player_actions,
//           data.player_buildings
//         );
//       }
//       return data.setting.zoom;
//     });
// };
