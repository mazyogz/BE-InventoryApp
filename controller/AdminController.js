const { user } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

exports.registerAdmin = async (req, res) => {
    const { username, email, phone, password, role } = req.body;
  
    if (email.endsWith("@yopmail.com")) {
      return res.status(400).json({
        success: false,
        message: "use another email",
      });
    }
  
    const emailExisted = await user.findOne({
      where: {
        email: email,
      },
    });
  
    if (emailExisted) {
      return res.status(409).json({
        status: false,
        msg: "Email already exists",
      });
    }
    const salt = 10;
    const hashPassword = await bcrypt.hash(password, salt);
    try {
      let userData = await user.create({
        username: username,
        email: email,
        password: hashPassword,
        phone: phone,
        role: role,
        register_date: new Date(),
      });
  
      userData = JSON.parse(JSON.stringify(userData));
  
      return res.status(200).json({
        success: true,
        message: "Register Successfully",
      });
    } catch (error) {
      console.log(error);
    }
  };

  exports.getUsers = async (req, res) => {
    try {
      const userData = await user.findAll({
        order: [["id", "ASC"]],
      });
      if (userData.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No users found",
          data: [],
        });
      }
  
      res.status(200).json({
        success: true,
        message: "List All Users",
        data: userData,
      });
    } catch (error) {
      console.log(error);
    }
  };