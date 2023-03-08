const Product = require('../models/Product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const { subcategory } = ctx.query;

  if (!subcategory) return next();
  let product = await Product.find({ subcategories: subcategory })
  console.log(product)
  ctx.body = ctx
};

module.exports.productList = async function productList(ctx, next) {
  ctx.body = {};
};

module.exports.productById = async function productById(ctx, next) {
  ctx.body = {};
};

