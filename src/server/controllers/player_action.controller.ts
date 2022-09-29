export {};
const models = require("../models");
const User = models.users;
const UserActions = models.player_actions;
const PlayerLand = models.lands;

// Retrieve all static building information
exports.findAll = (req, res) => {
  const account = req.params.account;
  User.findOne({
    where: { account: account },
    attributes: ["account"],
    include: [
      {
        model: UserActions,
        where: { validate: false },
        attributes: ["id", "actionType", "validated", "createdAt"],
      },
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving all actions of player",
      });
    });
};

exports.addOne = (req, res) => {
  const account = req.userData.account;
  const action = req.userData.action;
  console.log("req.userData", req.userData);

  User.findOne({
    where: { account: account },
    include: [
      {
        model: PlayerLand,
        attributes: ["id"],
      },
    ],
  })
    .then((user: any) => {
      console.log("user", user);
      const action_entry = {
        entrypoint: action.entrypoint,
        calldata: action.calldata,
        validated: false,
        fk_userid: user.id,
        fk_landid: user.land.id,
      };
      UserActions.create(action_entry)
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message: "Error while adding action to player",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error adding action to player",
      });
    });
};
