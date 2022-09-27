module.exports = (sequelize, Sequelize) => {
  const PlayerAction = sequelize.define("player_action", {
    actionType: {
      type: Sequelize.STRING,
      field: "actionType",
    },
    validated: {
      type: Sequelize.BOOLEAN,
      field: "validated",
    },
  });

  return PlayerAction;
};
