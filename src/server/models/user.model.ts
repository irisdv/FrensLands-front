module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    account: {
      type: Sequelize.STRING,
      field: "account",
    },
    inGameTime: {
      type: Sequelize.INTEGER,
      field: "inGameTime",
      defaultValue: 0,
    },
    nbActions: {
      type: Sequelize.INTEGER,
      field: "nbActions",
      defaultValue: 0,
    },
    totalBuild: {
      type: Sequelize.INTEGER,
      field: "totalBuild",
      defaultValue: 0,
    },
    totalHarvest: {
      type: Sequelize.INTEGER,
      field: "totalHarvest",
      defaultValue: 0,
    },
    log: {
      type: Sequelize.TEXT,
      field: "log",
    },
  });

  return User;
};
