const { user } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

exports.register = async (req, res) => {
  const { username, email, phone, password } = req.body;

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
      role: "user",
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

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let userData = await user.findOne({ where: { email } });

    if (!userData) {
      return res.status(400).json({ success: false, message: "Email not found" });
    }

    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Password did not match" });
    }

    const { id: userId, role, username, phone, address, nik } = userData;
    const tokenParams = { userId, role, username, email, address, phone };
    const accessToken = jwt.sign(tokenParams, "access", { expiresIn: "1h" });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    const data = {
      userId,
      username,
      email,
      address,
      phone,
      nik,
      accessToken,
      accessTokenExpiresIn: "1 hour",
    };

    return res.status(201).json({
      success: true,
      message: "Login Successfully",
      data: data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Login Failed" });
  }
};

exports.editUsers = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { username, phone, address, nik } = req.body;

    const existingUser = await user.findByPk(userId);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }

    if (username) {
      existingUser.username = username;
    }
    if (phone) {
      existingUser.phone = phone;
    }
    if (address) {
      existingUser.username = address;
    }
    if (nik) {
      existingUser.alamat = nik;
    }

    await existingUser.save();

    res.status(200).json({
      success: true,
      message: "Update data successfully",
      data: existingUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
    });
  }
};

exports.logout = (req, res) => {
  try {
    res.clearCookie("accessToken");
    return res.status(200).json({
      success: true,
      message: "Logout Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Logout Failed" });
  }
};

exports.forgotPasswordOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const users = await user.findOne({ where: { email } });

    if (!users) {
      return res
        .status(400)
        .json({ success: false, message: "Email not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    const expiresInMinutes = 1;
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes);

    users.otp = otp;
    users.otpExpiresAt = expiresAt;
    await users.save();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "yogiprass11@gmail.com",
        pass: "qmui uqbo pzay gjwe",
      },
    });

    const mailOptions = {
      from: "Inventory app",
      to: email,
      subject: "Password Reset OTP",
      text:
        `You are receiving this email because you requested a password reset for your account.\n\n` +
        `Please use the following OTP to reset your password:\n\n` +
        `OTP: ${otp}\n\n` +
        `This OTP will expire in ${expiresInMinutes} minutes.\n` +
        `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res
          .status(500)
          .json({ success: false, message: "Failed to send reset OTP" });
      }
      console.log("Reset OTP sent:", info.response);

      return res.status(200).json({ success: true, message: "Reset OTP sent" });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Forgot password failed" });
  }
};

exports.resetPasswordOTP = async (req, res) => {
  try {
    const { otp, newPassword } = req.body;

    const users = await user.findOne({ where: { otp } });

    if (!users) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    const currentTime = new Date();
    if (currentTime > user.otpExpiresAt) {
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired" });
    }

    const salt = 10;
    users.password = await bcrypt.hash(newPassword, salt);

    users.otp = null;
    users.otpExpiresAt = null;

    await users.save();

    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Password reset failed" });
  }
};
