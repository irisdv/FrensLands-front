import jwt from "jsonwebtoken";
const config = require("../config/auth.config");
import { Request, Response, NextFunction } from "express";

const db = require("../models");
const User = db.user;

const verifyToken = (request: any, response: Response, next: NextFunction) => {
  let token = request.headers["x-access-token"];

  if (!token) {
    return response.status(403).send({
      message: "No token provided!",
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return response.status(401).send({
        message: "Unauthorized!",
      });
    }
    // console.log('request', request.body)
    request.userData = request.body;
    next();
  });
};

const authJwt = {
  verifyToken: verifyToken,
};

module.exports = authJwt;
