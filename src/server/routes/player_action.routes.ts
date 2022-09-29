export {};
const { authJwt } = require("../middleware");
const player_actions = require("../controllers/player_action.controller");

module.exports = (app) => {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Retrieve all actions of a player
  app.get(
    "/api/player_action/:account",
    [authJwt.verifyToken],
    player_actions.findAll
  );

  // Save player actions
  app.post("/api/player_action", [authJwt.verifyToken], player_actions.addOne);
};
