module.exports = (sequelize, Sequelize) => {
  const PlayerBuilding = sequelize.define("player_building", {
    spriteId: {
      type: Sequelize.SMALLINT,
      field: "spriteId",
    },
    name: {
      type: Sequelize.STRING,
      field: "name",
    },
    posX: {
      type: Sequelize.FLOAT,
      field: "posX",
    },
    posY: {
      type: Sequelize.FLOAT,
      field: "posY",
    },
    blockX: {
      type: Sequelize.SMALLINT,
      field: "blockX",
    },
    blockY: {
      type: Sequelize.SMALLINT,
      field: "blockY",
    },
    unitTimeCreatedAt: {
      type: Sequelize.INTEGER,
      field: "unitTimeCreatedAt",
    },
    log: {
      type: Sequelize.STRING,
      field: "log",
    },
  });

  return PlayerBuilding;
};
