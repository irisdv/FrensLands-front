"use strict";
const fs = require("fs");
const path = require("path");
const dbConfig = require("../config/db.config");
const Sequelize = require("sequelize");
const pg = require("pg");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    dialectModule: pg,
    operatorsAliases: false,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
});

const db : any = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user.model")(sequelize, Sequelize);
db.settings = require("./setting.model")(sequelize, Sequelize);

// Static data
db.static_buildings = require("./static_building.model")(sequelize, Sequelize);
db.static_resources = require("./static_resource.model")(sequelize, Sequelize);
db.static_decorations = require("./static_decoration.model")(sequelize, Sequelize);

db.inventories = require("./inventory.model")(sequelize, Sequelize);
db.lands = require("./land.model")(sequelize, Sequelize);
db.player_buildings = require("./player_building.model")(sequelize, Sequelize);
db.player_resources_spawned = require("./player_resources_spawned.model")(sequelize, Sequelize);
db.player_actions = require("./player_action.model")(sequelize, Sequelize);
db.player_busyPops = require("./player_busyPop.model")(sequelize, Sequelize);

// Relationship between users and settings table in DB
db.users.hasOne(db.settings, {
  foreignKey: "fk_userid",
  targetKey: "id",
});
db.settings.belongsTo(db.users, {
  foreignKey: "fk_userid",
  targetKey: "id",
});

// Relationship between users and inventory table in DB
db.users.hasOne(db.inventories, {
  foreignKey: "fk_userid",
  targetKey: "id",
});
db.inventories.belongsTo(db.users, {
  foreignKey: "fk_userid",
  targetKey: "id",
});

// Relationship between users and land table in DB
db.users.hasOne(db.lands, {
  foreignKey: "fk_userid",
  targetKey: "id",
});
db.lands.belongsTo(db.users, {
  foreignKey: "fk_userid",
  targetKey: "id",
});


// Relationship between users / lands and player_building table in DB
db.users.hasMany(db.player_buildings, {
  foreignKey: "fk_userid",
  targetKey: "id",
});
db.player_buildings.belongsTo(db.users, {
  foreignKey: "fk_userid",
  targetKey: "id",
});

db.lands.hasMany(db.player_buildings, {
  foreignKey: "fk_landid",
  targetKey: "id",
});
db.player_buildings.belongsTo(db.lands, {
  foreignKey: "fk_landid",
  targetKey: "id",
});

// Relationship player_resources_spawned
db.users.hasMany(db.player_resources_spawned, {
  foreignKey: "fk_userid",
  targetKey: "id",
});
db.player_resources_spawned.belongsTo(db.users, {
  foreignKey: "fk_userid",
  targetKey: "id",
});

db.lands.hasMany(db.player_resources_spawned, {
  foreignKey: "fk_landid",
  targetKey: "id",
});
db.player_resources_spawned.belongsTo(db.lands, {
  foreignKey: "fk_landid",
  targetKey: "id",
});

// Relationship player_actions
db.users.hasMany(db.player_actions, {
  foreignKey: "fk_userid",
  targetKey: "id",
});
db.player_actions.belongsTo(db.users, {
  foreignKey: "fk_userid",
  targetKey: "id",
});

db.lands.hasMany(db.player_actions, {
  foreignKey: "fk_landid",
  targetKey: "id",
});
db.player_actions.belongsTo(db.lands, {
  foreignKey: "fk_landid",
  targetKey: "id",
});

// Relationship player_busyPop
db.users.hasMany(db.player_busyPops, {
  foreignKey: "fk_userid",
  targetKey: "id",
});
db.player_busyPops.belongsTo(db.users, {
  foreignKey: "fk_userid",
  targetKey: "id",
});

db.lands.hasMany(db.player_busyPops, {
  foreignKey: "fk_landid",
  targetKey: "id",
});
db.player_busyPops.belongsTo(db.lands, {
  foreignKey: "fk_landid",
  targetKey: "id",
});

module.exports = db;