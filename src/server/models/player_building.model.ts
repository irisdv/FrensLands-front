module.exports = (sequelize, Sequelize) => {
  const PlayerBuilding = sequelize.define("player_building", {
    gameUid: {
      type: Sequelize.SMALLINT,
      field: "gameUid",
    },
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
    decay: {
      type: Sequelize.SMALLINT,
      field: "decay",
    },
    unitTimeCreatedAt: {
      type: Sequelize.INTEGER,
      field: "unitTimeCreatedAt",
    },
    log: {
      type: Sequelize.TEXT,
      field: "log",
    },
  });

  return PlayerBuilding;
};
