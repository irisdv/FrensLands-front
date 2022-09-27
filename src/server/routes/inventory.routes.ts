const player_inventory = require("../controllers/inventory.controller");

var router = require("express").Router();

module.exports = (app) => {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/users/inventory/:address",
    [authJwt.verifyToken],
    player_inventory.create
  );
};
