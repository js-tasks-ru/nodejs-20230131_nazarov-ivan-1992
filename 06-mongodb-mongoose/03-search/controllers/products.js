const Product = require('../models/Product');
const mapProduct = require('../mappers/product')
const mongoose = require('mongoose');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const { query } = ctx.query;
  if (!query) return next();

  let products = await Product.find({
    $text: {
      $search: query,
      $caseSensitive: false,
    }
  });
  products = products.map(el => mapProduct(el))

  products = products.map(el => mapProduct(el))
  ctx.body = { products };
};
