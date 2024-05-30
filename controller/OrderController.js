const { Sequelize, cart, product, order_details, order } = require("../models");
const { v4: uuidv4 } = require("uuid");

exports.addToCart = async (req, res) => {
  const { product_id } = req.body;
  const userData = req.user;

  try {
    const productData = await product.findOne({
      where: {
        id: product_id,
      },
    });

    const addCart = await cart.create({
      product_id: productData.id,
      qty: 1,
      price: productData.price,
      user_id: userData.userId,
    });

    res.status(201).json({
      status: true,
      message: "Product berhasil ditambhakan ke keranjang",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Terjadi kesalahan saat membuat pemesanan",
      error: error.message,
    });
  }
};
exports.cartData = async (req, res) => {
  const userData = req.user;

  try {
    const cartData = await cart.findAll({
      where: {
        user_id: userData.userId,
        qty: {
          [Sequelize.Op.gt]: 0,
        },
      },
    });

    res.status(201).json({
      status: true,
      message: "cart data",
      data: cartData,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Terjadi kesalahan saat membuat pemesanan",
      error: error.message,
    });
  }
};

exports.createOrder = async (req, res) => {
  const { selectedCartItems } = req.body;
  const userData = req.user;

  const uniqueID = uuidv4();

  try {
    let totalPrice = 0;
    const orderPromises = selectedCartItems.map(async (item) => {
      const cartItem = await cart.findOne({ where: { id: item.id, user_id: userData.userId } });
      
      if (!cartItem) {
        throw new Error(`Cart item with ID ${item.id} not found`);
      }

      totalPrice += cartItem.qty * cartItem.price;

      return order_details.create({
        unique_id: uniqueID,
        product_id: cartItem.product_id,
        qty: cartItem.qty,
        price: cartItem.price,
        user_id: userData.userId
      });
    });
    
    await Promise.all(orderPromises);

    await order.create({
      unique_id: uniqueID,
      date: new Date(),
      status: 'pending',
      user_id: userData.userId,
      total: totalPrice
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the order',
      error: error.message,
    });
  }
};
