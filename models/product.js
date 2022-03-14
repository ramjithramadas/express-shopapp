const { ObjectId } = require("mongodb");
const { getDb } = require("../util/database");

class Product {
   constructor(title, price, description, imageUrl) {
      this.title = title;
      this.price = price;
      this.description = description;
      this.imageUrl = imageUrl;
   }

   save() {
      const db = getDb();
      return db
         .collection("products")
         .insertOne(this)
         .then((result) => {
            console.log(result);
         })
         .catch((err) => console.log(err));
   }

   update(id) {
      const db = getDb();
      return db
         .collection("products")
         .update({ _id: new ObjectId(id) }, { $set: this })
         .then((result) => {
            return result;
         })
         .catch((err) => console.log(err));
   }

   static findAll() {
      const db = getDb();
      return db
         .collection("products")
         .find()
         .toArray()
         .then((result) => {
            return result;
         })
         .catch((err) => console.log(err));
   }

   static findById(id) {
      const db = getDb();
      return db
         .collection("products")
         .find({ _id: new ObjectId(id) })
         .next()
         .then((result) => {
            //  console.log(result);
            return result;
         })
         .catch((err) => console.log(err));
   }

   static deleteById(id) {
      const db = getDb();
      return db
         .collection("products")
         .deleteOne({ _id: new ObjectId(id) })
         .then((result) => {
            console.log(result);
            return result;
         })
         .catch((err) => console.log(err));
   }
}

module.exports = Product;
