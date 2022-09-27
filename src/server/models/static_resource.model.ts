module.exports = (sequelize, Sequelize) => {
    const StaticResource = sequelize.define("static_resource", {
      spriteId: {
        type: Sequelize.SMALLINT,
        field: "spriteId",
      },
      biomeId: {
        type: Sequelize.SMALLINT,
        field: "biomeId",
      },
      name: {
        type: Sequelize.STRING,
        field: "name",
      },
      locked: {
        type: Sequelize.BOOLEAN,
        field: "locked",
        defaultValue: true
      },
      size: {
        type: Sequelize.SMALLINT,
        field: "size",
      },
      nbHarvest: {
        type: Sequelize.SMALLINT,
        field: "nbHarvest",
      },
      fertilityNeed: {
        type: Sequelize.SMALLINT,
        field: "fertilityNeed",
      },
      nbLevel: {
        type: Sequelize.SMALLINT,
        field: "nbLevel",
      },
      harvestCost: {
        type: Sequelize.STRING,
        field: "createCost",
      },
      production: {
        type: Sequelize.STRING,
        field: "production",
      },
    });
  
    return StaticResource;
  };