const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
   // Product.fetchAll((products) => {
   //    res.render("shop/product-list", {
   //       prods: products,
   //       pageTitle: "All Products",
   //       path: "/products",
   //    });
   // });
   Product.fetchAll()
      .then((result) => {
         res.render("shop/product-list", {
            prods: result[0],
            pageTitle: "All Products",
            path: "/products",
         });
      })
      .catch((err) => {
         console.log(err);
      });
};

exports.getProduct = (req, res, next) => {
   // Product.fetchById(req.params.id, (product) => {
   //    res.render("shop/product-detail", {
   //       product: product,
   //       pageTitle: product.title,
   //       path: "/products",
   //    });
   // });
   Product.fetchById(req.params.id)
      .then(([[product], fieldData]) =>
         res.render("shop/product-detail", {
            product: product,
            pageTitle: product.title,
            path: "/products",
         })
      )
      .catch((err) => console.error(err));
};

exports.getIndex = (req, res, next) => {
   // Product.fetchAll((products) => {
   //    res.render("shop/index", {
   //       prods: products,
   //       pageTitle: "Shop",
   //       path: "/",
   //    });
   // });
   Product.fetchAll()
      .then(([result, fieldData]) => {
         res.render("shop/index", {
            prods: result,
            pageTitle: "Shop",
            path: "/",
         });
      })
      .catch((err) => {
         console.log(err);
      });
};

exports.getCart = (req, res, next) => {
   Product.fetchAll((products) => {
      Cart.fetchCartProducts(products, (cart) => {
         res.render("shop/cart", {
            cart: cart,
            path: "/cart",
            pageTitle: "Your Cart",
         });
      });
   });
};

exports.deleteCartItem = (req, res, next) => {
   Product.fetchAll((products) => {
      Cart.removeCartItem(req.body.id, products);
      res.redirect("/cart");
   });
};

exports.postCart = (req, res, next) => {
   const prodId = req.body.productId;
   Product.fetchById(prodId, (product) => {
      Cart.addProduct(prodId, product.price);
   });
   res.redirect("/cart");
};

exports.getOrders = (req, res, next) => {
   res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
   });
};

exports.getCheckout = (req, res, next) => {
   res.render("shop/checkout", {
      path: "/checkout",
      pageTitle: "Checkout",
   });
};
