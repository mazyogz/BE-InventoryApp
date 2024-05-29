'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  product.init({
    category: DataTypes.STRING,
    name: DataTypes.STRING,
    image: DataTypes.TEXT,
    description: DataTypes.TEXT,
    price: DataTypes.INTEGER,
    is_deleted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'product',
  });
  return product;
};