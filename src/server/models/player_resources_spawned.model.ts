module.exports = (sequelize, Sequelize) => {
    const PlayerResourceSpawned = sequelize.define("player_resource_spawned", {
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
        field: "locked"
      },
      blockY: {
        type: Sequelize.SMALLINT,
        field: "locked"
      },
      nbHarvestLeft: {
        type: Sequelize.INTEGER,
        field: "nbHarvestLeft",
      },
      unitTimeHarvest: {
        type: Sequelize.INTEGER,
        field: "unitTimeHarvest",
      },
    });
  
    return PlayerResourceSpawned;
  };