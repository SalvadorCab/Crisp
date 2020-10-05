const faker = require('faker');

const createFakeProducts = () => ({
  title: faker.commerce.productName(),
  body_html: "<strong>Elegant Shirt</strong>", 
  sku: faker.random.alphaNumeric,
  vendor: "Crisps",
  product_type: faker.commerce.product,
  tags: "Crisps"
});

exports.seed = async function (knex) {
  const fakeProducts = [];
  const desiredFakeProducts = 100;

  for (let i = 0; i < desiredFakeProducts; i += 1) {
    fakeProducts.push(createFakeProducts());
  }

  await knex('a001_products').insert(fakeProducts);
};
