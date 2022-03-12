const Product = require("../models/product");
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
   Product.findAll()
      .then((products) => {
         res.render("shop/product-list", {
            prods: products,
            pageTitle: "All Products",
            path: "/products",
         });
      })
      .catch((err) => console.error(err));
};

exports.getProduct = (req, res, next) => {
   Product.findAll({
      where: {
         id: req.params.id,
      },
   })
      .then(([product]) => {
         // console.log(product);
         res.render("shop/product-detail", {
            product: product,
            pageTitle: product.title,
            path: "/products",
         });
      })
      .catch((err) => console.error(err));
   // Product.findByPk(req.params.id)
   //    .then((product) => {
   //      // console.log(product);
   //       res.render("shop/product-detail", {
   //          product: product,
   //          pageTitle: product.title,
   //          path: "/products",
   //       });
   //    })
   //    .catch((err) => console.error(err));
};

exports.getIndex = (req, res, next) => {
   Product.findAll()
      .then((products) => {
         //console.log(products);
         res.render("shop/index", {
            prods: products,
            pageTitle: "Shop",
            path: "/",
         });
      })
      .catch((err) => console.error(err));
};

exports.getCart = (req, res, next) => {
   req.user
      .getCart()
      .then((cart) => {
         return cart
            .getProducts()
            .then((products) => {
               res.render("shop/cart", {
                  products: products,
                  path: "/cart",
                  pageTitle: "Your Cart",
               });
            })
            .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
};

exports.deleteCartItem = (req, res, next) => {
   // Product.fetchAll((products) => {
   //    Cart.removeCartItem(req.body.id, products);
   //    res.redirect("/cart");
   // });
   const prodId = req.body.productId;
   console.log(req.body, "prodId");
   req.user
      .getCart()
      .then((cart) => {
         return cart.getProducts({ where: { id: prodId } });
      })
      .then((products) => {
         const product = products[0];
         return product.cartItem.destroy();
      })
      .then((result) => {
         res.redirect("/cart");
      })
      .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
   console.log(req.body, "req.body.productId;");
   const prodId = req.body.productId;
   let fetchedCart;
   let newQuantity = 1;
   req.user
      .getCart()
      .then((cart) => {
         fetchedCart = cart;
         return cart.getProducts({ where: { id: prodId } });
      })
      .then((products) => {
         let product;
         if (products.length > 0) {
            product = products[0];
         }

         if (product) {
            const oldQuantity = product.cartItem.quantity;
            newQuantity = oldQuantity + 1;
            return product;
         }
         return Product.findByPk(prodId);
      })
      .then((product) => {
         return fetchedCart.addProduct(product, {
            through: { quantity: newQuantity },
         });
      })
      .then(() => {
         res.redirect("/cart");
      })
      .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
   req.user
      .getOrders({ include: ["products"] })
      .then((orders) => {
         res.render("shop/orders", {
            path: "/orders",
            pageTitle: "Your Orders",
            orders: orders,
         });
      })
      .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
   let fetchedCart;
   req.user
      .getCart()
      .then((cart) => {
         fetchedCart = cart;
         //  console.log(cart, "cartcart");
         return cart.getProducts();
      })
      .then((products) => {
         // console.log(products, "productsproducts");
         return req.user
            .createOrder()
            .then((order) => {
               return order.addProducts(
                  products.map((product) => {
                     product.orderItem = { quantity: product.cartItem.quantity };
                     return product;
                  })
               );
            })
            .catch((err) => console.log(err));
      })
      .then(() => {
         return fetchedCart.setProducts(null);
      })
      .then(() => {
         res.redirect("/orders");
      })
      .catch((err) => console.log(err));
};

exports.getCheckout = (req, res, next) => {
   res.render("shop/checkout", {
      path: "/checkout",
      pageTitle: "Checkout",
   });
};
