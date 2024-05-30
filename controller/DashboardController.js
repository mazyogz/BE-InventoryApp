const { category, product } = require("../models");

exports.getAvailProduct = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 3;
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await product.findAndCountAll({
      order: [["id", "ASC"]],
      limit: limit,
      offset: offset,
      where: {
        is_deleted: 'false',
      },
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      success: true,
      message: "List All Available Product",
      data: rows,
      currentPage: page,
      totalPages: totalPages,
      totalItems: count,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving available products",
    });
  }
  };
exports.getProductById = async (req, res) => {
    try {
        const { productId } = req.params;
        const productData = await product.findOne({
          where: {
            id: productId,
          },
        });
    
        res.status(200).json({
          success: true,
          message: `product data id ${productId}`,
          data: productData,
        });
      } catch (error) {
        console.log(error);
      }
  };
exports.getProductByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const productData = await product.findAll({
          where: {
            category: category,
            is_deleted: 'false',
          },
        });
    
        res.status(200).json({
          success: true,
          message: `product data category ${category}`,
          data: productData,
        });
      } catch (error) {
        console.log(error);
      }
  };