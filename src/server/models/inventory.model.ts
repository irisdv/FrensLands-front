module.exports = (sequelize, Sequelize) => {
  const Inventory = sequelize.define("inventory", {
    // account: {
    //   type: Sequelize.STRING,
    //   field: "account",
    // },
    attractivityRatio: {
      type: Sequelize.SMALLINT,
      field: "attractivityRatio",
      defaultValue: 100,
    },
    wood: {
      type: Sequelize.INTEGER,
      field: "wood",
      defaultValue: 0,
    },
    rock: {
      type: Sequelize.INTEGER,
      field: "rock",
      defaultValue: 0,
    },
    food: {
      type: Sequelize.INTEGER,
      field: "food",
      defaultValue: 20,
    },
    metal: {
      type: Sequelize.INTEGER,
      field: "metal",
      defaultValue: 0,
    },
    coal: {
      type: Sequelize.INTEGER,
      field: "coal",
      defaultValue: 0,
    },
    gold: {
      type: Sequelize.INTEGER,
      field: "gold",
      defaultValue: 0,
    },
    energy: {
      type: Sequelize.INTEGER,
      field: "energy",
      defaultValue: 0,
    },
    coin: {
      type: Sequelize.INTEGER,
      field: "coin",
      defaultValue: 0,
    },
    totalPop: {
      type: Sequelize.INTEGER,
      field: "totalPop",
      defaultValue: 1,
    },
    freePop: {
      type: Sequelize.INTEGER,
      field: "freePop",
      defaultValue: 1,
    },
    timeSpent: {
      type: Sequelize.INTEGER,
      field: "timeSpent",
      defaultValue: 0,
    },
    level: {
      type: Sequelize.INTEGER,
      field: "level",
      defaultValue: 1,
    },
  });

  return Inventory;
};
