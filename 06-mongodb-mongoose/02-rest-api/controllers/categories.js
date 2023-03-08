const Category = require('../models/Category');
const mapCategory  = require('../mappers/category')

module.exports.categoryList = async function categoryList(ctx, next) {
  let categories = await Category.find()
  ctx.body = {categories: mapCategory(categories)};
};
