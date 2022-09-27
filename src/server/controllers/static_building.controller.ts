export {};
const db = require("../../models");
const StaticBuilding = db.static_buildings;

// Retrieve static building information by id
exports.findOne = (req, res) => {
  const id = req.params.id;
  StaticBuilding.findOne({
    where: { id: id },
    // attributes: ["id", "spriteId"],
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          status: "not_found",
          message: `Cannot find Building with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Building with id=" + id,
      });
    });
};

// Retrieve all static building information
exports.findAll = (req, res) => {
  StaticBuilding.findAll()
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          status: "not_found",
          message: `Cannot fetch all static buildings.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving all static buildings",
      });
    });
};
