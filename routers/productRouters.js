const express = require("express");
const productRouter = express.Router();
const { productGet, productPost, addProduct, searchProduct, productDetail, productUpdate, productDelete, softDelete} = require("../controllers/productControllers");
const {authenticated, adminOnly}= require("../middlewares/middleware")

productRouter.use(authenticated);

productRouter.get("/products", productGet);
productRouter.post("/products", productPost);
productRouter.get("/add-product",adminOnly, addProduct);
productRouter.get("/find-products", searchProduct);
productRouter.get("/product-detail", productDetail);
productRouter.post("/product-update/:id",adminOnly, productUpdate)
productRouter.post("/productDelete/:id", adminOnly, productDelete)
productRouter.delete("/products/:id/delete",adminOnly,softDelete)

module.exports = productRouter;