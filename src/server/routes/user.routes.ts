const { authJwt } = require("../middleware");
const users = require("../controllers/user.controller");

module.exports = (app) => {
  // var router = require("express").Router();

  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // https://www.bezkoder.com/node-express-sequelize-postgresql/#Test_the_APIs

  // Create a new user
  // router.post('/', users.create);
  // app.post("/api/users", users.create)

  // Retrieve a single User from address with resources
  // router.get("/:account", [authJwt.verifyToken], users.findOne);
  app.get("/api/users/:account", [authJwt.verifyToken], users.findOne);

  app.post("/api/users/settings", [authJwt.verifyToken], users.updateSettings);

  // Update a User from address
  // router.put("/:wallet_address", users.update);

  // Increment resources of user from address
  // router.put("/resources/:address", users.updateResources);

  // Delete a User from address and its resources
  // router.delete("/:wallet_address", users.delete);

  // Retrieve all Users with their resources
  // router.get("/", users.findAll);

  // Delete all users
  // router.delete("/", users.deleteAll);

  // app.use('/api/users', router);
};
