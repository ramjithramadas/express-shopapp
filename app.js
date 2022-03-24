const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const errorController = require("./controllers/error");
const sequelize = require("./util/database");
const main = require("./util/database");
const isAuth = require("./middlewares/is-auth");

// const Product = require("./models/product");
const User = require("./models/user");
// const Cart = require("./models/cart");
// const CartItem = require("./models/cart-item");
// const Order = require("./models/order");
// const OrderItem = require("./models/order-item");

const app = express();
dotenv.config();

const store = new MongoDBStore({
    uri: process.env.ATLAS_URI,
    collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const { mongoConnect } = require("./util/database");

app.use(bodyParser.urlencoded({ extended: false }));
// to serve statically -->
app.use(express.static(path.join(__dirname, "public")));
app.use(
    session({
        secret: "mysecret",
        resave: false,
        saveUninitialized: false,
        store: store,
    })
);

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then((user) => {
            req.user = user;
            next();
        })
        .catch((err) => console.log(err));
});

app.use("/admin", isAuth, adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

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
        // User.findOne().then((user) => {
        //     if (!user) {
        //         const user = new User({
        //             name: "Ram",
        //             email: "ram@test.com",
        //             cart: {
        //                 items: [],
        //             },
        //         });
        //         user.save();
        //     }
        // });

        app.listen(3001, () => {
            console.log("Server is running on port 3001");
        });
    })
    .catch((err) => console.log("error:", err));
