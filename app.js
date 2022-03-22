const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const errorController = require("./controllers/error");
const sequelize = require("./util/database");
const main = require("./util/database");

// const Product = require("./models/product");
// const User = require("./models/user");
// const Cart = require("./models/cart");
// const CartItem = require("./models/cart-item");
// const Order = require("./models/order");
// const OrderItem = require("./models/order-item");

const app = express();
dotenv.config();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const { mongoConnect } = require("./util/database");

app.use(bodyParser.urlencoded({ extended: false }));

// to serve statically -->
app.use(express.static(path.join(__dirname, "public")));

// app.use((req, res, next) => {
//     User.findById("6231d376a6f5327198f5f68b")
//         .then((user) => {
//             req.user = new User(user.username, user.email, user.cart, user._id);
//             next();
//         })
//         .catch((err) => console.log(err));
// });

app.use("/admin", adminRoutes);
app.use(shopRoutes);

// handling 404 page
app.use(errorController.get404);

// mongoConnect(() => {
//     app.listen(3001, () => {
//         console.log("Server is running on port 3001");
//     });
// });

mongoose
    .connect(process.env.ATLAS_URI)
    .then(() => {
        app.listen(3001, () => {
            console.log("Server is running on port 3001");
        });
    })
    .catch((err) => console.log("error:", err));
