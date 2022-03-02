const fs = require("fs");
const path = require("path");
const { uid } = require("../util/utils");
const Cart = require("./cart");

const p = path.join(path.dirname(require.main.filename), "data", "products.json");

const getProductsFromFile = (cb) => {
   fs.readFile(p, (err, fileContent) => {
      if (err) {
         cb([]);
      } else {
         cb(JSON.parse(fileContent));
      }
   });
};

module.exports = class Product {
   constructor(id, title, imageUrl, description, price) {
      this.id = id || uid();
      this.title = title;
      this.imageUrl = imageUrl;
      this.description = description;
      this.price = price;
   }

   save() {
      // this.id = uid();
      getProductsFromFile((products) => {
         console.log(this, "thisss");
         products.push(this);
         fs.writeFile(p, JSON.stringify(products), (err) => {
            console.log(err);
         });
      });
   }

   update() {
      getProductsFromFile((products) => {
         const newProducts = [...products];
         const updatedProductIndex = newProducts.findIndex((p) => p.id === this.id);
         newProducts[updatedProductIndex] = this;
         fs.writeFile(p, JSON.stringify(newProducts), (err) => {
            console.log(err);
         });
      });
   }

   static fetchAll(cb) {
      getProductsFromFile(cb);
   }

   static fetchById(id, cb) {
      getProductsFromFile((products) => {
         const product = products.find((p) => p.id === id);
         cb(product);
      });
   }

   static deleteById(id) {
      getProductsFromFile((products) => {
         const product = products.find((prod) => prod.id === id);
         const updatedProducts = products.filter((prod) => prod.id !== id);
         fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
            if (!err) {
               Cart.removeCartItem(id, products);
            }
         });
      });
   }
};
