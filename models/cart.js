const fs = require("fs");
const path = require("path");

const p = path.join(path.dirname(require.main.filename), "data", "cart.json");

module.exports = class Cart {
   static addProduct(id, productPrice) {
      // Fetch the previous cart
      fs.readFile(p, (err, fileContent) => {
         let cart = { products: [], totalPrice: 0 };
         if (!err) {
            cart = JSON.parse(fileContent);
         }

         // Analyze the cart => find the existing product
         const existingProductIndex = cart.products.findIndex((p) => p.id === id);
         const existingProduct = cart.products[existingProductIndex];
         let updatedProduct;

         // Add new product / increase quantity
         if (existingProduct) {
            updatedProduct = { ...existingProduct };
            updatedProduct.quantity = updatedProduct.quantity + 1;
            cart.products = [...cart.products];
            cart.products[existingProductIndex] = updatedProduct;
            console.log("working");
         } else {
            updatedProduct = { id: id, quantity: 1 };
            cart.products = [...cart.products, updatedProduct];
         }
         cart.totalPrice = cart.totalPrice + +productPrice;
         fs.writeFile(p, JSON.stringify(cart), (err) => {
            console.log(err);
         });
      });
   }

   static removeCartItem(id, products) {
      fs.readFile(p, (err, fileContent) => {
         let cart = { products: [], totalPrice: 0 };
         if (!err) {
            cart = JSON.parse(fileContent);
         }
         for (var i = 0; i < cart.products.length; ++i) {
            for (var j = 0; j < products.length; ++j) {
               if (cart.products[i].id == products[j].id) {
                  cart.products[i].productDetails = products[j];
               }
            }
         }
         let deletedProduct = cart.products.find((p) => p.id === id);
         let updatedCart = cart.products.filter((p) => p.id !== id);
         cart.products = updatedCart;
         cart.totalPrice = cart.totalPrice - +deletedProduct.productDetails.price * deletedProduct.quantity;
         console.log(deletedProduct, "deletedProduct");
         console.log(cart, "cart");
         fs.writeFile(p, JSON.stringify(cart), (err) => {
            console.log(err);
         });
      });
   }

   static fetchCartProducts(products, cb) {
      fs.readFile(p, (err, fileContent) => {
         let cart = { products: [], totalPrice: 0 };
         if (!err) {
            cart = JSON.parse(fileContent);
         }
         for (var i = 0; i < cart.products.length; ++i) {
            for (var j = 0; j < products.length; ++j) {
               if (cart.products[i].id == products[j].id) {
                  cart.products[i].productDetails = products[j];
               }
            }
         }
         cb(cart);
      });
   }
};
