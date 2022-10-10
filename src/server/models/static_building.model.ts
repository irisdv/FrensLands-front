module.exports = (sequelize, Sequelize) => {
  const StaticBuilding = sequelize.define("static_building", {
    type: {
      type: Sequelize.STRING,
      field: "type",
    },
    spriteId: {
      type: Sequelize.STRING,
      field: "spriteId",
    },
    animated: {
      type: Sequelize.BOOLEAN,
      field: "animated",
      defaultValue: true,
    },
    biomeId: {
      type: Sequelize.STRING,
      field: "biomeId",
    },
    name: {
      type: Sequelize.STRING,
      field: "name",
    },
    description: {
      type: Sequelize.STRING,
      field: "description",
    },
    pLevelToUnlock: {
      type: Sequelize.SMALLINT,
      field: "pLevelToUnlock",
    },
    locked: {
      type: Sequelize.BOOLEAN,
      field: "locked",
      defaultValue: true,
    },
    size: {
      type: Sequelize.SMALLINT,
      field: "size",
    },
    canDestroy: {
      type: Sequelize.BOOLEAN,
      field: "canDestroy",
      defaultValue: true,
    },
    canMove: {
      type: Sequelize.BOOLEAN,
      field: "canMove",
      defaultValue: true,
    },
    fertilityNeed: {
      type: Sequelize.SMALLINT,
      field: "fertilityNeed",
    },
    nbLevel: {
      type: Sequelize.SMALLINT,
      field: "nbLevel",
    },
    needMaintain: {
      type: Sequelize.BOOLEAN,
      field: "needMaintain",
      defaultValue: true,
    },
    createCost: {
      type: Sequelize.STRING,
      field: "createCost",
      defaultValue: null,
    },
    maintainCost: {
      type: Sequelize.STRING,
      field: "maintainCost",
      defaultValue: null,
    },
    repairCost: {
      type: Sequelize.STRING,
      field: "repairCost",
      defaultValue: null,
    },
    production: {
      type: Sequelize.STRING,
      field: "production",
      defaultValue: null,
    },
  });

  return StaticBuilding;
};
