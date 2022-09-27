module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
      account: {
        type: Sequelize.STRING,
        field: "account",
      },
      inGameTime: {
        type: Sequelize.INTEGER,
        field: "inGameTime",
      },
      nbActions: {
        type: Sequelize.INTEGER,
        field: "nbActions",
      },
      nbLands: {
        type: Sequelize.SMALLINT,
        field: "nbLands",
      },
      totalBuild: {
        type: Sequelize.INTEGER,
        field: "totalBuild",
      },
      totalHarvest: {
        type: Sequelize.INTEGER,
        field: "totalHarvest",
      },
      log: {
        type: Sequelize.STRING,
        field: "log",
      },
    });
  
    return User;
  };