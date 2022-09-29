const { authJwt } = require("../middleware");
const users = require("../controllers/user.controller");

module.exports = (app) => {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Retrieve a single User from address
  app.get("/api/users/:account", [authJwt.verifyToken], users.findOne);

  app.post("/api/users/settings", [authJwt.verifyToken], users.updateSettings);

  app.post("/api/users/init", [authJwt.verifyToken], users.initGame);
};
