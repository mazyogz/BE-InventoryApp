const { Sequelize, cart, product, order_details, order } = require("../models");
const { v4: uuidv4 } = require("uuid");
const midtransClient = require("midtrans-client");

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
      include: [
        {
          model: product,
          attributes: ["name","image","price"],
        },
      ],
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

    const deleteCartPromises = selectedCartItems.map(async (item) => {
      await cart.destroy({ where: { id: item.id, user_id: userData.userId } });
    });
    await Promise.all(deleteCartPromises);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data:uniqueID
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

exports.createPayment = async (req, res) => {
  const userData = req.user;
  const { orderId } = req.params;
  try {
    const orderData = await order.findOne({
      where: {
        unique_id: orderId,
      },
    });
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: "SB-Mid-server-v4ZJdgQET4My17Ngk-pb6T1g",
      clientKey: "SB-Mid-client-HV7aOKK1G2a7GXBn",
    });

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: Math.ceil(orderData.dataValues.total),
      },
      customer_details: {
        first_name: userData.nama_lengkap,
        email: userData.email,
      },
    };

    snap.createTransaction(parameter).then((transaction) => {
      const dataPayment = {
        response: JSON.stringify(transaction),
      };
      const token = transaction.token;

      res.status(200).json({ message: "berhasil", dataPayment, token });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
