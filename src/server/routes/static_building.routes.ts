const static_buildings = require("../controllers/static_building.controller");

module.exports = (app) => {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/static_buildings", static_buildings.findAll);

  app.get("/api/static_buildings/:id", static_buildings.findOne);
};
