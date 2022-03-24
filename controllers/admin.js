const Product = require("../models/product");
const { uid } = require("../util/utils");

exports.getAddProduct = (req, res, next) => {
    res.render("admin/add-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true,
        isAuthenticated: req.session.isLoggedIn,
    });
};

exports.postAddProduct = (req, res, next) => {
    //   const id = uid();
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const userId = req.user._id;
    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.user,
    });
    product
        .save()
        .then(() => {
            res.redirect("/admin/products");
        })
        .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
    const prodId = req.params.id;
    Product.findById(prodId)
        .then((product) => {
            res.render("admin/edit-product", {
                product: product,
                pageTitle: "Edit Product",
                path: "/admin/edit-product",
                formsCSS: true,
                productCSS: true,
                activeAddProduct: true,
                isAuthenticated: req.session.isLoggedIn,
            });
        })
        .catch((err) => console.error(err));
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.params.id;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    // const product = new Product(title, price, description, imageUrl);
    Product.findById(prodId)
        .then((product) => {
            product.title = title;
            product.imageUrl = imageUrl;
            product.price = price;
            product.description = description;
            return product.save();
        })
        .then(() => {
            res.redirect("/admin/products");
        })
        .catch((err) => console.log(err));
};

exports.deleteProduct = (req, res, next) => {
    const prodId = req.params.id;
    console.log(prodId, "prodId");
    Product.findByIdAndRemove(prodId)
        .then(() => res.redirect("/admin/products"))
        .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
    Product.find()
        .then((products) => {
            //console.log(products);
            res.render("admin/products", {
                prods: products,
                pageTitle: "Admin Products",
                path: "/admin/products",
                isAuthenticated: req.session.isLoggedIn,
            });
        })
        .catch((err) => console.error(err));
};
