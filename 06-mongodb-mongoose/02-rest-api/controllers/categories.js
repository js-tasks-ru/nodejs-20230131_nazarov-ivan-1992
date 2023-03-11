const Category = require('../models/Category');
const mapCategory  = require('../mappers/category')

module.exports.categoryList = async function categoryList(ctx, next) {
  let categories = await Category.find()
  categories = categories.map(el => mapCategory(el))
  ctx.body = { categories };
};
