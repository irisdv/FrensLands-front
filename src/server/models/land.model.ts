module.exports = (sequelize, Sequelize) => {
  const Land = sequelize.define("land", {
    biomeId: {
      type: Sequelize.SMALLINT,
      field: "biomeId",
    },
    fullMap: {
      type: Sequelize.STRING,
      field: "fullMap",
    },
    nbResourceSpawned: {
      type: Sequelize.STRING,
      field: "nbResourceSpawned",
    },
    nbResourceLeft: {
      type: Sequelize.STRING,
      field: "nbResourceLeft",
    },
    nbBuilding: {
      type: Sequelize.INTEGER,
      field: "nbBuilding",
    },
  });

  return Land;
};
