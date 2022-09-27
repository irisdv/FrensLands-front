module.exports = (sequelize, Sequelize) => {
    const Inventory = sequelize.define("inventory", {
      account: {
        type: Sequelize.STRING,
        field: "account",
      },
      attractivityRatio: {
        type: Sequelize.SMALLINT,
        field: "attractivityRatio",
      },
      wood: {
        type: Sequelize.INTEGER,
        field: "wood",
      },
      rock: {
        type: Sequelize.INTEGER,
        field: "rock",
      },
      food: {
        type: Sequelize.INTEGER,
        field: "food",
      },
      metal: {
        type: Sequelize.INTEGER,
        field: "metal",
      },
      coal: {
        type: Sequelize.INTEGER,
        field: "coal",
      },
      gold: {
        type: Sequelize.INTEGER,
        field: "gold",
      },
      energy: {
        type: Sequelize.INTEGER,
        field: "energy",
      },
      coin: {
        type: Sequelize.INTEGER,
        field: "coin",
      },
      totalPop: {
        type: Sequelize.INTEGER,
        field: "totalPop",
      },
      freePop: {
        type: Sequelize.INTEGER,
        field: "freePop",
      },
      timeSpent: {
        type: Sequelize.INTEGER,
        field: "timeSpent",
      },
      level: {
        type: Sequelize.INTEGER,
        field: "level",
      },
    });
  
    return Inventory;
  };