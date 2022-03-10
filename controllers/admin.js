const Product = require("../models/product");
const { uid } = require("../util/utils");

exports.getAddProduct = (req, res, next) => {
   res.render("admin/add-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      formsCSS: true,
      productCSS: true,
      activeAddProduct: true,
   });
};

exports.getEditProduct = (req, res, next) => {
   Product.fetchById(req.params.id, (product) => {
      res.render("admin/edit-product", {
         product: product,
         pageTitle: "Edit Product",
         path: "/admin/edit-product",
         formsCSS: true,
         productCSS: true,
         activeAddProduct: true,
      });
   });
};

exports.postEditProduct = (req, res, next) => {
   const id = req.params.id;
   const title = req.body.title;
   const imageUrl = req.body.imageUrl;
   const price = req.body.price;
   const description = req.body.description;
   const product = new Product(id, title, imageUrl, description, price);
   product.update();
   res.redirect("/admin/products");
};

exports.postAddProduct = (req, res, next) => {
   const id = uid();
   const title = req.body.title;
   const imageUrl = req.body.imageUrl;
   const price = req.body.price;
   const description = req.body.description;
   // const product = new Product(id, title, imageUrl, description, price);
   // product
   //    .save()
   //    .then(() => {
   //       res.redirect("/");
   //    })
   //    .catch((err) => console.error(err));
   Product.create({
      title: title,
      imageUrl: imageUrl,
      price: price,
      description: description,
   })
      .then((result) => {
         //  console.log(result);
         res.redirect("/");
      })
      .catch((err) => console.log(err));
};

exports.deleteProduct = (req, res, next) => {
   Product.deleteById(req.params.id);
   res.redirect("/admin/products");
};

exports.getProducts = (req, res, next) => {
   Product.fetchAll((products) => {
      res.render("admin/products", {
         prods: products,
         pageTitle: "Admin Products",
         path: "/admin/products",
      });
   });
};
