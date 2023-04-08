const Category = require('./models/Category');
const Product = require('./models/Product');
const connection = require('./libs/connection');

(async () => {
    await Category.deleteMany();
    await Product.deleteMany();

    let category = await Category.create({
        title: 'Category1',
        subcategories: [{
            title: 'Subcategory1',
        }],
    });

    let product = await Product.create({
        title: 'Product1',
        description: 'Description1',
        price: 10,
        category: category.id,
        subcategory: category.subcategories[0].id,
        images: ['image1'],
      });

      console.log('product.id:', product.id)
      console.log('category.id:', category.id)

      connection.close();
})()
