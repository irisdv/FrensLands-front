module.exports = (sequelize, Sequelize) => {
  const PlayerBusyPop = sequelize.define("player_busyPop", {
    timeUnitAvailable: {
      type: Sequelize.INTEGER,
      field: "timeUnitAvailable",
    },
    nbFrens: {
      type: Sequelize.INTEGER,
      field: "nbFrens",
    },
  });

  return PlayerBusyPop;
};
