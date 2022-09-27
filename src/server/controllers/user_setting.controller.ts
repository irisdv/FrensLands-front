export {};
const models = require("../models");
const UserSettings = models.user_settings;
const Users = models.users;

//  Create resources entry for user from address
exports.create = (req, res) => {
  const account = req.params.address;

  Users.findOne({ where: { account: account } })
    .then((data) => {
      console.log("id of user", data.id);

      const user_setting = {
        user_id: data.id,
      };

      UserSettings.create(user_setting)
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message ||
              "Some error occurred while initializing user settings.",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating user settings.",
      });
    });
};
