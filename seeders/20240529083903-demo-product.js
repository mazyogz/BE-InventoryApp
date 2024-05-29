'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "products",
      [
        {
          category: 'Electronics',
          name: 'Smartphone',
          image: 'https://ik.imagekit.io/96v3ucrbi/IMG-1702391512135_WG26ApKxP.jpg',
          description: 'HP with 8GB RAM and 512GB storage.',
          price: 1000,
          is_deleted: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          category: 'Electronics',
          name: 'TV',
          image: 'https://ik.imagekit.io/96v3ucrbi/IMG-1702391512135_WG26ApKxP.jpg',
          description: 'TV kantor',
          price: 1000,
          is_deleted: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          category: 'Stationery',
          name: 'Pulpen',
          image: 'https://ik.imagekit.io/96v3ucrbi/IMG-1702391512135_WG26ApKxP.jpg',
          description: 'Pen kantor',
          price: 1000,
          is_deleted: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          category: 'Stationery',
          name: 'Buku',
          image: 'https://ik.imagekit.io/96v3ucrbi/IMG-1702391512135_WG26ApKxP.jpg',
          description: 'Buku kantor',
          price: 1000,
          is_deleted: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ],
      {}
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
  }
};
