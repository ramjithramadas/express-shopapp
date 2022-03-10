const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const errorController = require("./controllers/error");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));

// to serve statically -->
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

// handling 404 page
app.use(errorController.get404);

app.listen(3001, () => {
   console.log("Server is running on port 3001");
});
