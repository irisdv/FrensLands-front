module.exports = (sequelize, Sequelize) => {
  const PlayerAction = sequelize.define("player_action", {
    entrypoint: {
      type: Sequelize.STRING,
      field: "entrypoint",
    },
    calldata: {
      type: Sequelize.STRING,
      field: "calldata",
    },
    validated: {
      type: Sequelize.BOOLEAN,
      field: "validated",
    },
  });

  return PlayerAction;
};
