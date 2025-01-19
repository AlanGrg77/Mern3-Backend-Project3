import express, { Router } from "express";
import userMiddleware, { Role } from "../middleware/userMiddlerware";
import ProductController from "../controllers/productController";
import multer from "multer";
import { storage } from "../middleware/multerMiddleware";

const productRouter: Router = express.Router();

const upload = multer({storage:storage})

productRouter.route('/')
.get(ProductController.getAllProduct)
.post(userMiddleware.isUserLoggedIn, userMiddleware.accessTo(Role.Admin), upload.single('productImageUrl'), ProductController.createProduct)
productRouter.route('/:id')
.get(ProductController.getSingleProduct)
.delete(userMiddleware.isUserLoggedIn, userMiddleware.accessTo(Role.Admin), ProductController.deleteProduct)



export default productRouter;
