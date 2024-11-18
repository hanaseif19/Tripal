const User = require("../models/users/User");
const TourGuide = require("../models/users/TourGuide");
const Advertiser = require("../models/users/Advertiser");
const Admin = require("../models/users/Admin");
const Seller = require("../models/users/Seller");
const Tourist = require("../models/users/Tourist");
const TourismGovernor = require("../models/users/TourismGovernor");
const Request = require("../models/Request");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const express = require("express");
const router = express.Router();
const app = express();
require("dotenv").config();

app.use(cookieParser());

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const loginUser = async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const user = await User.findOne({ userName });

    if (!user) {
      const request = await Request.findOne({ userName });
      if (!request) {
        return res
          .status(400)
          .json({ message: "Invalid username or password" });
      }
      if (!(await bcrypt.compare(password, request.password))) {
        return res
          .status(400)
          .json({ message: "Invalid username or password" });
      }
      if (request.status === "pending")
        return res.status(403).json({
          message: "Request is pending",
        });
      return res.status(401).json({ message: "Request has been rejected" });
    }

    let userSchema;
    switch (user.role) {
      case "Tour Guide":
        userSchema = TourGuide;
        break;
      case "Advertiser":
        userSchema = Advertiser;
        break;
      case "Seller":
        userSchema = Seller;
        break;
      case "Tourist":
        userSchema = Tourist;
        break;
      case "Tourism Governor":
        userSchema = TourismGovernor;
        break;
      case "Admin":
        userSchema = Admin;
        break;
    }

    // Find the user in the relevant schema
    const roleUser = await userSchema.findOne({ userName });
    if (roleUser && (await bcrypt.compare(password, roleUser.password))) {
      const token = generateToken(roleUser._id, user.role);
      res.cookie("jwt", token, {
        httpOnly: true,
        //maxAge: 3600 * 1000, //changed to session cookie
      });
      res.status(200).json({ token });
    } else {
      res.status(400).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserData = async (req, res) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).send("No token found");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json(decoded);
  } catch (err) {
    res.status(401).send("Invalid token");
  }
};

module.exports = { loginUser, generateToken, getUserData };
