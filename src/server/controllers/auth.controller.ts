export {};

const db = require("../models");
var jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const models = require("../models");
const User = db.users;
const UserSetting = models.settings;

exports.signin = (req, res) => {
  if (!req.body.account) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  User.findOne({
    where: {
      account: req.body.account,
    },
    attributes: ["account"],
    include: [
      {
        model: UserSetting,
        attributes: ["zoom", "tutorial", "sound"],
      },
    ],
  })
    .then((user: any) => {
      if (!user) {
        const user = {
          account: req.body.account,
        };

        var new_user;
        User.create(user)
          .then((data) => {
            new_user = data;
            return UserSetting.create();
          })
          .then((user_settings) => {
            new_user.setSetting(user_settings);
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating the User.",
            });
          });
      }

      var token = jwt.sign({ account: req.body.account }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      if (user) {
        return res.send({
          token: token,
          account: user.account,
          setting: user.setting,
        });
      } else {
        return res.send({
          token: token,
          account: req.body.account,
          setting: { zoom: 1, tutorial: 1, sound: 1 },
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
