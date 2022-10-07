module.exports = (sequelize, Sequelize) => {
  const Land = sequelize.define("land", {
    biomeId: {
      type: Sequelize.SMALLINT,
      field: "biomeId",
    },
    fullMap: {
      type: Sequelize.TEXT,
      field: "fullMap",
    },
    nbResourceSpawned: {
      type: Sequelize.SMALLINT,
      field: "nbResourceSpawned",
    },
    nbResourceLeft: {
      type: Sequelize.SMALLINT,
      field: "nbResourceLeft",
    },
    nbBuilding: {
      type: Sequelize.INTEGER,
      field: "nbBuilding",
    },
  });

  return Land;
};
