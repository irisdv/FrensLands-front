export {};
const models = require("../models");
const User = models.users;
const UserSetting = models.settings;

// Retrieve user information and resource by wallet address
exports.findOne = (req, res) => {
    const account = req.params.account;
    User.findOne({
        where: { account: account },
        attributes: ["account"],
        include: [
            {
                model: UserSetting,
                attributes: [
                    "zoom",
                    "tutorial",
                    "sound"
                ],
            },
        ],
    })
        .then((data) => {
        if (data) {
            res.send(data);
        }
        else {
            res.status(404).send({
                status: "not_found",
                message: `Cannot find User with account=${account}.`,
            });
        }
    })
        .catch((err) => {
        res.status(500).send({
            message: "Error retrieving User with account=" + account,
        });
    });
};

exports.updateSettings = (req, res) => {
    const account = req.userData.account;
    console.log('req.userData', req.userData)

    User.findOne({
        where: { account: account }
    })
    .then((user : any) => {
        UserSetting.update(req.userData.setting, {
            where: {fk_userid: user.id}
        })
        .then((data: any) => {
            res.send("Settings updated successfully")
        })
        .catch((err : any) => {
            res.status(500).send({
              message: "Error updating Settings for account=" + account
            });
        });

    })
    .catch((err : any) => {
        res.status(500).send({
            message: "Error updating Settings for account=" + account
        });
    });
}