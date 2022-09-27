const user_settings = require("../controllers/user_setting.controller");

var router = require("express").Router();

module.exports = (app) => {
  // app.use(function(req, res, next) {
  //   res.header(
  //     "Access-Control-Allow-Headers",
  //     "x-access-token, Origin, Content-Type, Accept"
  //   );
  //   next();
  // });

  app.post("/api/userSettings/:address", user_settings.create);
};
