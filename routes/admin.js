const path = require("path");

const express = require("express");

const adminController = require("../controllers/admin");

const router = express.Router();

router.get("/add-product", adminController.getAddProduct);

router.get("/products", adminController.getProducts);

router.post("/add-product", adminController.postAddProduct);

router.get("/edit-product/:id", adminController.getEditProduct);

router.post("/edit-product/:id", adminController.postEditProduct);

router.post("/delete-product/:id", adminController.deleteProduct);

module.exports = router;
