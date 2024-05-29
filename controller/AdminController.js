const { user, category, product } = require("../models");
const bcrypt = require("bcrypt");

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

exports.getTotalCustomers = async (req, res) => {
  try {
    const totalCustomers = await user.count({
      where: {
        role: "user",
      },
    });

    res.status(200).json({
      success: true,
      message: "Total number of customers",
      data: totalCustomers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message:
        "An error occurred while retrieving the total number of customers",
    });
  }
};

exports.getAllProduct = async (req, res) => {
  try {
    const productData = await product.findAll({
      order: [["id", "ASC"]],
    });
    if (productData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No product found",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "List All Product",
      data: productData,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getAllTotalProduct = async (req, res) => {
  try {
    const allTotalProduct = await product.count({
    });

    res.status(200).json({
      success: true,
      message: "Total number of product",
      data: allTotalProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message:
        "An error occurred while retrieving the total number of product",
    });
  }
};

exports.getAllCategory = async (req, res) => {
  try {
    const categoryData = await category.findAll({
      order: [["id", "ASC"]],
    });
    if (categoryData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No product found",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "List All Product",
      data: categoryData,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getTotalCategories= async (req, res) => {
  try {
    const allTotalCategories= await category.count({
    });

    res.status(200).json({
      success: true,
      message: "Total number of product",
      data: allTotalCategories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message:
        "An error occurred while retrieving the total number of product",
    });
  }
};