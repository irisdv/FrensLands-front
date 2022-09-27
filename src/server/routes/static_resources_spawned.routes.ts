const static_resources_spawned = require("../controllers/static_resources_spawned.controller");

module.exports = (app) => {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/static_resources_spawned", static_resources_spawned.findAll);

  app.get(
    "/api/static_resources_spawned/:id",
    static_resources_spawned.findOne
  );
};
