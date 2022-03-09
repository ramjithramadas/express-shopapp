const fs = require("fs");
const path = require("path");
const { uid } = require("../util/utils");
const Cart = require("./cart");
const db = require("../util/database");

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
      return db.execute("INSERT INTO products (title,price,description,imageUrl) VALUES(?,?,?,?)", [
         this.title,
         this.price,
         this.description,
         this.imageUrl,
      ]);
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

   static fetchAll() {
      return db.execute("SELECT * FROM products");
   }

   static fetchById(id) {
      return db.execute(`SELECT * FROM products WHERE products.id=?`, [id]);
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
