import path from "path";
import http from "http";
import https from "https";
import fs from "fs";
const csv = require("fast-csv");
import { Server, Socket } from "socket.io";
import cors from "cors";
// import { uuid } from "uuidv4";
const express = require("express");

const app = express();

// Get port from environment and store in Express
const port = process.env.PORT || 3001;
app.set("port", port);

var corsOptions = {
  origin: "http://localhost:8008",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../client")));

const db = require("./models"); // import models DB
db.sequelize.sync();
//db.sequelize.sync({ force: true });
// -------------- DEBUG : UNCOMMENT TO DROP ALL DB --------------
// db.sequelize.sync().then(function () {
//   return db.sequelize.drop();
// });

var dbInitialized = false;

require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);
require("./routes/static_building.routes")(app);
require("./routes/static_resources_spawned.routes")(app);
require("./routes/player_action.routes")(app);

/** catch 404 and forward to error handler */
app.use("*", (req, res) => {
  return res.status(404).json({
    success: false,
    message: "API endpoint doesnt exist",
  });
});

const server = http.createServer(app); // create http server
server.listen(port); // Listen on provided port, on all network interfaces

//-------------- TEST : IMPORT CSV STATIC DATA INTO DB --------------

// if (!dbInitialized) {
//   // Add fixed data from csv file
//   const db = require("./models");

//   const StaticBuilding = db.static_buildings;
//   const inputFile = path.resolve(__dirname, "./data/buildings.csv");
//   let buildingData = [];

//   const StaticRS = db.static_resources;
//   const rsFile = path.resolve(__dirname, "./data/rs.csv");
//   let rsData = [];

//   fs.createReadStream(inputFile)
//     .pipe(csv.parse({ headers: true }))
//     .on("error", (error) => {
//       throw error.message;
//     })
//     .on("data", (row) => {
//       buildingData.push(row);
//     })
//     .on("end", () => {
//       StaticBuilding.bulkCreate(buildingData)
//         .then(() => {
//           console.log("success");
//         })
//         .catch((error) => {
//           console.log("error", error);
//         });
//     });

//   fs.createReadStream(rsFile)
//     .pipe(csv.parse({ headers: true }))
//     .on("error", (error) => {
//       throw error.message;
//     })
//     .on("data", (row) => {
//       rsData.push(row);
//     })
//     .on("end", () => {
//       StaticRS.bulkCreate(rsData)
//         .then(() => {
//           console.log("success");
//         })
//         .catch((error) => {
//           console.log("error", error);
//         });
//     });
//   dbInitialized = true;
// }

//  ------------ SOCKETS MANAGEMENT ------------
// const io = require("socket.io")(server);
// app.set("socketio", io); // set socketio in app to use it in routes

// io.on("connection", (socket: Socket) => {
//   console.log("new client connected", socket.id);

//   // socket.on("updateSettings", (data) => {
//   //     console.log('updateSettings', data)

//   //     socket.emit('zoomUpdated', data)
//   // })
//   // socket.emit('hello');
// });

server.on("listening", () => {
  console.log(`Listening on port:: http://localhost:${port}/`);
});
