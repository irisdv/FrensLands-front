export {};
const models = require("../models");
const StaticResources = models.static_resources;

// Retrieve static resource spawned information by id
exports.findOne = (req, res) => {
  const id = req.params.id;
  StaticResources.findOne({
    where: { id: id },
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          status: "not_found",
          message: `Cannot find static resource spawned with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving static resource spawned with id=" + id,
      });
    });
};

// Retrieve all static resources spawned information
exports.findAll = (req, res) => {
  StaticResources.findAll()
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          status: "not_found",
          message: `Cannot fetch all static resources spawned.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving all static resources spawned",
      });
    });
};
