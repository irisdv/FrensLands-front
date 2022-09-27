module.exports = (sequelize, Sequelize) => {
    const Setting = sequelize.define("setting", {
      zoom: {
        type: Sequelize.BOOLEAN,
        field: "zoom",
        defaultValue: true
      },
      tutorial: {
        type: Sequelize.BOOLEAN,
        field: "tutorial",
        defaultValue: true
      },
      sound: {
        type: Sequelize.BOOLEAN,
        field: "sound",
        defaultValue: true
      },

    });
  
    return Setting;
  };