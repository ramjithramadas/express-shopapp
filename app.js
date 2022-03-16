const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const errorController = require("./controllers/error");
const sequelize = require("./util/database");
const main = require("./util/database");

// const Product = require("./models/product");
const User = require("./models/user");
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

app.use((req, res, next) => {
    User.findById("62316653a6f5327198f5f676")
        .then((user) => {
            req.user = user;
            next();
        })
        .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

// handling 404 page
app.use(errorController.get404);

mongoConnect(() => {
    app.listen(3001, () => {
        console.log("Server is running on port 3001");
    });
});
