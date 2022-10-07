export {};
const models = require("../models");
const User = models.users;
const UserSetting = models.settings;
const PlayerInventory = models.inventories;
const PlayerLand = models.lands;
const PlayerBuilding = models.player_buildings;
const PlayerAction = models.player_actions;

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
        attributes: ["posX", "posY", "blockX", "blockY", "fk_buildingid"],
      },
      {
        model: PlayerLand,
        attributes: ["id", "biomeId", "fullMap"],
      },
      {
        model: PlayerAction,
        attributes: ["entrypoint", "calldata"],
        where: { validated: false },
      },
      // player rs spawned
      // Player busyPop
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
