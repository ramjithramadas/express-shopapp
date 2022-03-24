const Product = require("../models/product");
const User = require("../models/user");
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
    Product.find()
        .then((products) => {
            res.render("shop/product-list", {
                prods: products,
                pageTitle: "All Products",
                path: "/products",
                isAuthenticated: req.session.isLoggedIn,
            });
        })
        .catch((err) => console.error(err));
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.id;
    Product.findById(prodId)
        .then((product) => {
            console.log(product);
            res.render("shop/product-detail", {
                product: product,
                pageTitle: product.title,
                path: "/products",
                isAuthenticated: req.session.isLoggedIn,
            });
        })
        .catch((err) => console.error(err));
};

exports.getIndex = (req, res, next) => {
    Product.find()
        .then((products) => {
            res.render("shop/index", {
                prods: products,
                pageTitle: "Shop",
                path: "/",
                isAuthenticated: req.session.isLoggedIn,
            });
        })
        .catch((err) => console.error(err));
};

exports.getCart = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect("/login");
    }
    req.user
        .populate("cart.items.productId")
        .then((user) => {
            const products = user.cart.items;
            res.render("shop/cart", {
                products: products,
                path: "/cart",
                pageTitle: "Your Cart",
                isAuthenticated: req.session.isLoggedIn,
            });
        })
        .catch((err) => console.error(err));
};

exports.deleteCartItem = (req, res, next) => {
    const prodId = req.body.productId;
    req.user
        .deleteCartItem(prodId)
        .then(() => {
            res.redirect("/cart");
        })
        .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then((product) => {
            return req.user.addToCart(product);
        })
        .then((result) => {
            res.redirect("/cart");
        })
        .catch((err) => console.error(err));
};

exports.getOrders = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect("/login");
    }
    Order.find({ "user.userId": req.user._id })
        .then((orders) => {
            res.render("shop/orders", {
                path: "/orders",
                pageTitle: "Your Orders",
                orders: orders,
                isAuthenticated: req.session.isLoggedIn,
            });
        })
        .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
    req.user
        .populate("cart.items.productId")
        .then((user) => {
            const products = user.cart.items.map((i) => {
                return {
                    quantity: i.quantity,
                    product: { ...i.productId._doc },
                };
            });
            const order = new Order({
                user: {
                    name: req.user.name,
                    userId: req.user,
                },
                products: products,
            });
            return order.save();
        })
        .then(() => {
            return req.user.clearCart();
        })
        .then(() => {
            res.redirect("/orders");
        })
        .catch((err) => console.error(err));
};

// exports.getCheckout = (req, res, next) => {
//    res.render("shop/checkout", {
//       path: "/checkout",
//       pageTitle: "Checkout",
//    });
// };
