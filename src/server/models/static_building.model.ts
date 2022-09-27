module.exports = (sequelize, Sequelize) => {
    const StaticBuilding = sequelize.define("static_building", {
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
      canDestroy: {
        type: Sequelize.BOOLEAN,
        field: "canDestroy",
        defaultValue: true
      },
      canMove: {
        type: Sequelize.BOOLEAN,
        field: "canMove",
        defaultValue: true
      },
      fertilityNeed: {
        type: Sequelize.SMALLINT,
        field: "fertilityNeed",
      },
      nbLevel: {
        type: Sequelize.SMALLINT,
        field: "nbLevel",
      },
      maintain: {
        type: Sequelize.BOOLEAN,
        field: "maintain",
        defaultValue: true
      },
      createCost: {
        type: Sequelize.STRING,
        field: "createCost",
      },
      maintainCost: {
        type: Sequelize.STRING,
        field: "maintainCost",
      },
      production: {
        type: Sequelize.STRING,
        field: "production",
      },
    });
  
    return StaticBuilding;
  };