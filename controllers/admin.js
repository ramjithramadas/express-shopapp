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
   Product.findByPk(req.params.id)
      .then((product) => {
         // console.log(product);
         res.render("admin/edit-product", {
            product: product,
            pageTitle: "Edit Product",
            path: "/admin/edit-product",
            formsCSS: true,
            productCSS: true,
            activeAddProduct: true,
         });
      })
      .catch((err) => console.error(err));
};

exports.postEditProduct = (req, res, next) => {
   const id = req.params.id;
   const title = req.body.title;
   const imageUrl = req.body.imageUrl;
   const price = req.body.price;
   const description = req.body.description;
   Product.update(
      { title: title, imageUrl: imageUrl, price: price, description: description },
      { where: { id: id } }
   )
      .then(() => {
         res.redirect("/admin/products");
      })
      .catch((err) => console.log(err));
};

exports.postAddProduct = (req, res, next) => {
   const id = uid();
   const title = req.body.title;
   const imageUrl = req.body.imageUrl;
   const price = req.body.price;
   const description = req.body.description;
   Product.create({
      title: title,
      imageUrl: imageUrl,
      price: price,
      description: description,
   })
      .then(() => {
         res.redirect("/");
      })
      .catch((err) => console.log(err));
};

exports.deleteProduct = (req, res, next) => {
   const prodId = req.params.id;
   Product.destroy({
      where: {
         id: prodId,
      },
   })
      .then(() => res.redirect("/admin/products"))
      .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
   Product.findAll()
      .then((products) => {
         //console.log(products);
         res.render("admin/products", {
            prods: products,
            pageTitle: "Admin Products",
            path: "/admin/products",
         });
      })
      .catch((err) => console.error(err));
};
