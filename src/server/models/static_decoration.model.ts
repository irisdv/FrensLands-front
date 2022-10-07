module.exports = (sequelize, Sequelize) => {
  const StaticDecoration = sequelize.define("static_decoration", {
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
      defaultValue: false,
    },
    biomeId: {
      type: Sequelize.STRING,
      field: "biomeId",
    },
    name: {
      type: Sequelize.STRING,
      field: "name",
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
    nbLevel: {
      type: Sequelize.SMALLINT,
      field: "nbLevel",
    },
    maintain: {
      type: Sequelize.BOOLEAN,
      field: "maintain",
      defaultValue: true,
    },
    createCost: {
      type: Sequelize.STRING,
      field: "createCost",
    },
    isNFT: {
      type: Sequelize.BOOLEAN,
      field: "isNFT",
      defaultValue: false,
    },
    contractAddress: {
      type: Sequelize.STRING,
      field: "contractAddress",
      defaultValue: null,
    },
  });

  return StaticDecoration;
};