export {};
const models = require("../models");
const User = models.users;
const UserSetting = models.settings;
const PlayerInventory = models.inventories;
const PlayerLand = models.lands;
const PlayerBuilding = models.player_buildings;
const PlayerAction = models.player_actions;
import { initMap } from "../utils/constant";

// Retrieve user information
exports.findOne = (req, res) => {
  const account = req.params.account;
  User.findOne({
    where: { account: account },
    attributes: ["account"],
    include: [
      {
        model: UserSetting,
        attributes: ["zoom", "tutorial", "sound"],
      },
      {
        model: PlayerInventory,
        attributes: [
          "wood",
          "rock",
          "food",
          "metal",
          "coal",
          "gold",
          "energy",
          "coin",
          "totalPop",
          "freePop",
          "timeSpent",
          "level",
        ],
      },
      {
        model: PlayerBuilding,
        attributes: [
          "posX",
          "posY",
          "blockX",
          "blockY",
          "fk_buildingid",
          "decay",
        ],
      },
      {
        model: PlayerLand,
        attributes: ["id", "biomeId", "fullMap", "nbResourceSpawned"],
      },
      {
        model: PlayerAction,
        attributes: ["entrypoint", "calldata"],
        where: { validated: false },
      },
    ],
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          status: "not_found",
          message: `Cannot find User with account=${account}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with account=" + account,
      });
    });
};

// Update player settings
exports.updateSettings = (req, res) => {
  const account = req.userData.account;
  console.log("req.userData", req.userData);

  User.findOne({
    where: { account: account },
  })
    .then((user: any) => {
      UserSetting.update(req.userData.setting, {
        where: { fk_userid: user.id },
      })
        .then((data: any) => {
          res.send("Settings updated successfully");
        })
        .catch((err: any) => {
          res.status(500).send({
            message: "Error updating Settings for account=" + account,
          });
        });
    })
    .catch((err: any) => {
      res.status(500).send({
        message: "Error updating Settings for account=" + account,
      });
    });
};

// Initialize new game for player
exports.initGame = (req, res) => {
  const account = req.userData.account;
  const biomeId = req.userData.biomeId;

  var current_user;
  var landId;

  User.findOne({
    where: { account: account },
  })
    .then((user: any) => {
      // Init inventory
      current_user = user;
      const player_inventory = {
        fk_userid: current_user.id,
      };

      PlayerInventory.create(player_inventory)
        .then((data) => {
          // Init land
          const player_land = {
            fk_userid: current_user.id,
            biomeId: biomeId,
            fullMap: initMap,
            nbResourceSpawned: 196,
            nbResourceLeft: 196,
            nbBuilding: 1,
          };

          PlayerLand.create(player_land)
            .then((data) => {
              landId = data.id;
              // Init cabin
              const cabin = {
                fk_userid: current_user.id,
                fk_landid: data.id,
                fk_buildingid: 1,
                posX: 1.2,
                posY: 1.2,
                blockX: 11,
                blockY: 8,
                decay: 100,
                unitTimeCreatedAt: 0,
              };

              PlayerBuilding.create(cabin)
                .then((data: any) => {
                  const start_game = {
                    entrypoint: "start_game",
                    calldata: biomeId,
                    validated: false,
                    fk_userid: current_user.id,
                    fk_landid: landId,
                  };
                  PlayerAction.create(start_game)
                    .then((data) => {
                      res.send({ success: 1 });
                    })
                    .catch((err) => {
                      res.status(500).send({
                        message:
                          err.message ||
                          "Some error occurred while creating player action.",
                      });
                    });
                })
                .catch((err) => {
                  res.status(500).send({
                    message:
                      err.message ||
                      "Some error occurred while initializing cabin.",
                  });
                });
            })
            .catch((err) => {
              res.status(500).send({
                message:
                  err.message ||
                  "Some error occurred while initializing player land.",
              });
            });
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message ||
              "Some error occurred while initializing player inventory.",
          });
        });
    })
    .catch((err: any) => {
      res.status(500).send({
        message: "Error initializing game for account=" + account,
      });
    });
};

// Update user data after harvest
exports.harvest = (req, res) => {
  const account = req.userData.account;
  const landId = req.userData.biomeId;
  const inventory = req.userData.inventory;
  const fullMap = req.userData.fullMap;

  var current_user;
  var user_id;

  User.findOne({
    where: { account: account },
  })
    .then((user: any) => {
      user_id = user.id;
      current_user = {
        nbActions: user.nbActions + 1,
        totalHarvest: user.nbActions + 1,
      };

      User.update(current_user, {
        where: { account: account },
      })
        .then((data: any) => {
          var current_land = {
            fullMap: fullMap,
            // TODO add nbResourcesLeft
          };
          // Update land full Map
          PlayerLand.update(current_land, {
            where: { fk_userid: user_id },
          })
            .then((data: any) => {
              var current_inventory = {
                wood: inventory[0],
                rock: inventory[1],
                food: inventory[2],
                metal: inventory[3],
                coal: inventory[4],
                energy: inventory[5],
                coin: inventory[6],
                gold: inventory[7],
                freePop: inventory[8],
                totalPop: inventory[9],
                level: inventory[11],
              };

              PlayerInventory.update(current_inventory, {
                where: { fk_userid: user_id },
              })
                .then((data: any) => {
                  // ? add actions here
                  res.send({ success: 1 });
                })
                .catch((err: any) => {
                  res.status(500).send({
                    message:
                      "Error updating user inventory with account=" + account,
                  });
                });
            })
            .catch((err: any) => {
              res.status(500).send({
                message: "Error updating user land with account=" + account,
              });
            });
        })
        .catch((err: any) => {
          res.status(500).send({
            message: "Error updating user with account=" + account,
          });
        });
    })
    .catch((err: any) => {
      res.status(500).send({
        message: "Error finding user with account=" + account,
      });
    });
};
