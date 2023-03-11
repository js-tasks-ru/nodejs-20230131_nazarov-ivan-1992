const Product = require('../models/Product');
const mapProduct = require('../mappers/product')
const mongoose = require('mongoose');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const { subcategory } = ctx.query;

  if (!subcategory) return next();
  let products = await Product.find({ subcategory: subcategory });
  products = products.map(el => mapProduct(el))
  ctx.body = { products };
};

module.exports.productList = async function productList(ctx, next) {
  let products = await Product.find()
  products = products.map(el => mapProduct(el))
  ctx.body = { products };
};

module.exports.productById = async function productById(ctx, next) {
  let productId = ctx.params.id;
  if (!mongoose.isValidObjectId(productId)) {
    ctx.throw(400, 'Invalid ObjectId');
  }

  let product = await Product.find({ _id: productId });
 
  if (product.length === 0) {
    ctx.throw(404, 'Not Found');
  }

  ctx.body = { product: mapProduct(product[0]) };
};

