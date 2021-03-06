const mongoose = require("mongoose");
const Product = require("./product");

const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    passwordResetToken: {
        type: String,
    },
    passwordResetTokenExp: {
        type: Date,
    },
    cart: {
        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
            },
        ],
    },
});

// add products to the cart:
userSchema.methods.addToCart = function (product) {
    const cartProductIndex = this.cart.items.findIndex((cp) => {
        return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
        updatedCartItems.push({
            productId: product._id,
            quantity: newQuantity,
        });
    }

    const updatedCart = {
        items: updatedCartItems,
    };
    this.cart = updatedCart;
    return this.save();
};

// deleting an item from the cart:
userSchema.methods.deleteCartItem = function (id) {
    const updatedCartItems = this.cart.items.filter((p) => {
        return p.productId.toString() !== id.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
};

// clearing the cart:
userSchema.methods.clearCart = function (id) {
    this.cart = { items: [] };
    return this.save();
};

module.exports = mongoose.model("User", userSchema);

// const { ObjectId } = require("mongodb");
// const { getDb } = require("../util/database");

// class User {
//     constructor(username, email, cart, userId) {
//         this.username = username;
//         this.email = email;
//         this.cart = cart; // {items:[]}
//         this._id = userId;
//     }

//     save() {
//         const db = getDb();
//         return db
//             .collection("users")
//             .insertOne(this)
//             .then((result) => {
//                 console.log(result);
//             })
//             .catch((err) => console.log(err));
//     }

//     addToCart(product) {
//         const cartProductIndex = this.cart.items.findIndex((cp) => {
//             return cp.productId.toString() === product._id.toString();
//         });
//         let newQuantity = 1;
//         const updatedCartItems = [...this.cart.items];

//         if (cartProductIndex >= 0) {
//             newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//             updatedCartItems[cartProductIndex].quantity = newQuantity;
//         } else {
//             updatedCartItems.push({
//                 productId: new ObjectId(product._id),
//                 quantity: newQuantity,
//             });
//         }

//         const updatedCart = {
//             items: updatedCartItems,
//         };
//         const db = getDb();
//         return db
//             .collection("users")
//             .updateOne(
//                 { _id: new ObjectId(this._id) },
//                 { $set: { cart: updatedCart } }
//             );
//     }

//     static findById(id) {
//         const db = getDb();
//         return db
//             .collection("users")
//             .findOne({ _id: new ObjectId(id) })
//             .then((result) => {
//                 return result;
//             })
//             .catch((err) => console.log(err));
//     }

//     getCartItems() {
//         const db = getDb();
//         const productIds = this.cart.items.map((i) => {
//             return i.productId;
//         });
//         return db
//             .collection("products")
//             .find({ _id: { $in: productIds } })
//             .toArray()
//             .then((products) => {
//                 return products.map((p) => {
//                     return {
//                         ...p,
//                         quantity: this.cart.items.find((i) => {
//                             return i.productId.toString() === p._id.toString();
//                         }).quantity,
//                     };
//                 });
//             });
//     }

//     deleteCartItem(id) {
//         const updatedCartItems = this.cart.items.filter((p) => {
//             return p.productId.toString() !== id.toString();
//         });
//         const db = getDb();
//         return db
//             .collection("users")
//             .updateOne(
//                 { _id: new ObjectId(this._id) },
//                 { $set: { cart: { items: updatedCartItems } } }
//             )
//             .then((result) => {
//                 return result;
//             })
//             .catch((err) => console.log(err));
//     }

//     addOrder() {
//         const db = getDb();
//         return this.getCartItems()
//             .then((products) => {
//                 const order = {
//                     items: products,
//                     user: {
//                         _id: new ObjectId(this._id),
//                         name: this.username,
//                     },
//                 };
//                 return db.collection("orders").insertOne(order);
//             })
//             .then((result) => {
//                 this.cart = { item: [] };
//                 return db
//                     .collection("users")
//                     .updateOne(
//                         { _id: new ObjectId(this._id) },
//                         { $set: { cart: { items: [] } } }
//                     );
//             })
//             .catch((err) => console.log(err));
//     }

//     getOrders() {
//         const db = getDb();
//         return db
//             .collection("orders")
//             .find({ "user._id": new ObjectId(this._id) })
//             .toArray();
//     }
// }

// module.exports = User;
